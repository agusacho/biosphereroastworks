const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client (Service Role for Backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { cart, customer, paymentMethod } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total securely on server
        let gross_amount = 0;
        const item_details = [];

        for (const item of cart) {
            const subtotal = item.price * item.qty;
            gross_amount += subtotal;
            item_details.push({
                id: item.id,
                price: item.price,
                quantity: item.qty,
                name: item.name.substring(0, 50) // Midtrans limit 50 char
            });
        }

        const order_id = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Insert into Supabase Orders table
        const orderData = {
            id: order_id,
            items: cart,
            total_price: gross_amount,
            customer_email: customer.email || 'guest@example.com',
            customer_name: customer.name || 'Guest',
            payment_method: paymentMethod || 'midtrans',
            status: 'pending' // Initial status
        };

        const { error: dbError } = await supabase
            .from('orders')
            .insert([orderData]);

        if (dbError) {
            console.error("Database Error:", dbError);
            throw new Error(`Failed to save order to database: ${dbError.message}`);
        }

        // Prepare Midtrans Transaction
        const transactionDetails = {
            transaction_details: {
                order_id: order_id,
                gross_amount: gross_amount
            },
            item_details: item_details,
            customer_details: {
                first_name: customer.name || 'Guest',
                email: customer.email || 'guest@example.com'
            }
        };

        // Create Snap Transaction Token
        const transaction = await snap.createTransaction(transactionDetails);

        // Return token and order_id to frontend
        return res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: order_id
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
