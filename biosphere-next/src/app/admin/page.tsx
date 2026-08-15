"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FaBoxOpen, FaUsers, FaChartLine } from 'react-icons/fa6';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth check mockup
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      // In a real app, you'd check user role or specific email
      if (session) {
        setIsAdmin(true);
      }
      setLoading(false);
    }
    checkSession();
  }, []);

  const handleLogin = async () => {
    // For demo purposes, we will mock login. The original used Magic Links.
    alert("Admin login akan segera diimplementasikan dengan fitur otentikasi lengkap Supabase.");
  };

  if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center">Memuat...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        <div className="bg-surface p-10 rounded-2xl shadow-md border border-border w-full max-w-[400px] text-center">
          <h2 className="text-2xl font-bold font-heading text-primary mb-6">Admin Panel</h2>
          <button 
            className="w-full bg-primary text-surface py-3 rounded-xl font-bold hover:bg-accent transition-colors"
            onClick={handleLogin}
          >
            Masuk sebagai Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-extrabold text-primary font-heading mb-8">Dashboard Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl">
              <FaBoxOpen />
            </div>
            <div>
              <p className="text-text-muted text-sm font-bold">Total Produk</p>
              <h3 className="text-2xl font-extrabold text-primary">24</h3>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-text-muted text-sm font-bold">Pelanggan Aktif</p>
              <h3 className="text-2xl font-extrabold text-primary">156</h3>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center text-2xl">
              <FaChartLine />
            </div>
            <div>
              <p className="text-text-muted text-sm font-bold">Penjualan Bulan Ini</p>
              <h3 className="text-2xl font-extrabold text-primary">Rp 12.5M</h3>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-bold font-heading text-primary mb-6">Produk Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-text-muted font-bold">ID</th>
                  <th className="p-3 text-text-muted font-bold">Nama Produk</th>
                  <th className="p-3 text-text-muted font-bold">Kategori</th>
                  <th className="p-3 text-text-muted font-bold">Harga/Varian</th>
                  <th className="p-3 text-text-muted font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-bg-main transition-colors">
                  <td className="p-3">#PRD-01</td>
                  <td className="p-3 font-bold text-primary">Gayo Aceh</td>
                  <td className="p-3"><span className="bg-success text-surface px-2 py-1 text-xs rounded-full">green</span></td>
                  <td className="p-3">Rp 95.000</td>
                  <td className="p-3"><button className="text-accent font-bold hover:underline">Edit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
