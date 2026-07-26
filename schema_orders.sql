-- ==========================================
-- SCRIPT PEMBUATAN TABEL ORDERS
-- ==========================================

-- 1. Buat tabel orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    items JSONB NOT NULL,
    total_price NUMERIC NOT NULL,
    customer_email TEXT,
    customer_name TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'pending'
);

-- 2. Nonaktifkan Row Level Security (RLS) untuk kemudahan awal
-- PERHATIAN: Karena kita menggunakan backend Vercel dengan SERVICE_ROLE_KEY,
-- operasi dari backend akan selalu diizinkan meskipun RLS aktif.
-- Namun, mematikan RLS berguna jika Anda ingin membaca data pesanan secara langsung
-- dari frontend (seperti menampilkan riwayat belanja ke user).
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
