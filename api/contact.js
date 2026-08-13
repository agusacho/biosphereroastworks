const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client (Service Role for Backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const rateLimit = new Map();
const LIMIT = 5; // Max requests
const WINDOW_MS = 60 * 1000; // 1 minute

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const userLimit = rateLimit.get(ip) || { count: 0, startTime: now };

    if (now - userLimit.startTime > WINDOW_MS) {
        userLimit.count = 1;
        userLimit.startTime = now;
    } else {
        userLimit.count++;
        if (userLimit.count > LIMIT) {
            return res.status(429).json({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' });
        }
    }
    rateLimit.set(ip, userLimit);

    try {
        const { nama, email, pesan } = req.body;

        if (!nama || !email || !pesan) {
            return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi.' });
        }

        // Insert into Supabase contacts table
        const { error: dbError } = await supabase
            .from('contacts')
            .insert([{ nama, email, pesan }]);

        if (dbError) {
            console.error("Database Error:", dbError);
            throw new Error(`Failed to save contact message: ${dbError.message}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Pesan berhasil dikirim.'
        });

    } catch (error) {
        console.error('Contact Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
