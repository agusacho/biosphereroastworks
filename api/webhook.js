const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Supabase Client (Service Role for Backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const notification = req.body;
        
        // Verifikasi Signature Key Midtrans untuk Keamanan
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const signatureStr = notification.order_id + notification.status_code + notification.gross_amount + serverKey;
        const expectedSignature = crypto.createHash('sha512').update(signatureStr).digest('hex');

        if (notification.signature_key !== expectedSignature) {
            console.error('Invalid signature key from Midtrans');
            return res.status(403).json({ error: 'Invalid signature' });
        }

        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        let newStatus = 'pending';

        if (transactionStatus == 'capture'){
            if (fraudStatus == 'challenge'){
                newStatus = 'challenge';
            } else if (fraudStatus == 'accept'){
                newStatus = 'paid';
            }
        } else if (transactionStatus == 'settlement'){
            newStatus = 'paid';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
            newStatus = 'failed';
        } else if (transactionStatus == 'pending'){
            newStatus = 'pending';
        }

        console.log(`Update Order ${orderId} status to ${newStatus}`);

        // Update database di Supabase
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            console.error('Failed to update Supabase:', error);
            return res.status(500).json({ error: 'Database update failed' });
        }

        return res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
