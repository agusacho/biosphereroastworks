const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client (Service Role for Backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

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
