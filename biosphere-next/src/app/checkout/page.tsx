"use client";
import { useCartStore } from '@/store/useCartStore';
import { FaBuildingColumns, FaQrcode, FaWallet } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const { getTotalPrice, items, clearCart } = useCartStore();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handlePayment = () => {
    if (!selectedMethod) return;
    alert(`Memproses pembayaran dengan ${selectedMethod} sebesar ${formatRupiah(getTotalPrice())}. (Mockup)`);
    clearCart();
    router.push('/produk');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        <div className="bg-surface p-10 rounded-2xl shadow-sm border border-border text-center max-w-[500px]">
          <h2 className="text-2xl font-bold font-heading text-primary mb-4">Keranjang Kosong</h2>
          <p className="text-text-muted mb-6">Anda belum menambahkan produk apapun ke keranjang.</p>
          <button 
            className="bg-primary text-surface px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
            onClick={() => router.push('/produk')}
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-10 px-6">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl font-extrabold text-primary font-heading mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ringkasan */}
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm sticky top-[100px]">
              <h2 className="font-bold text-lg text-primary border-b border-border pb-4 mb-4">Ringkasan Pesanan</h2>
              <div className="flex flex-col gap-3 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-text-muted">{item.quantity}x {item.product.name}</span>
                    <span className="font-bold">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-text-muted font-bold">Total</span>
                <span className="font-extrabold text-xl text-accent">{formatRupiah(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-6">Pilih Metode Pembayaran</h2>
              
              <div className="flex flex-col gap-4">
                <button 
                  className={`flex items-center p-4 border rounded-xl text-left transition-colors ${selectedMethod === 'BCA Virtual Account' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  onClick={() => setSelectedMethod('BCA Virtual Account')}
                >
                  <FaBuildingColumns className="text-[#0066AE] text-2xl mr-4" />
                  <div>
                    <strong className="block text-primary">BCA Virtual Account</strong>
                    <span className="text-xs text-text-muted">Verifikasi Otomatis</span>
                  </div>
                </button>

                <button 
                  className={`flex items-center p-4 border rounded-xl text-left transition-colors ${selectedMethod === 'Mandiri Virtual Account' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  onClick={() => setSelectedMethod('Mandiri Virtual Account')}
                >
                  <FaBuildingColumns className="text-[#003D79] text-2xl mr-4" />
                  <div>
                    <strong className="block text-primary">Mandiri Virtual Account</strong>
                    <span className="text-xs text-text-muted">Verifikasi Otomatis</span>
                  </div>
                </button>

                <button 
                  className={`flex items-center p-4 border rounded-xl text-left transition-colors ${selectedMethod === 'QRIS' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  onClick={() => setSelectedMethod('QRIS')}
                >
                  <FaQrcode className="text-[#E65100] text-2xl mr-4" />
                  <div>
                    <strong className="block text-primary">QRIS (Gopay, OVO, Dana, dll)</strong>
                    <span className="text-xs text-text-muted">Scan QR Code</span>
                  </div>
                </button>

                <button 
                  className={`flex items-center p-4 border rounded-xl text-left transition-colors ${selectedMethod === 'GoPay' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  onClick={() => setSelectedMethod('GoPay')}
                >
                  <FaWallet className="text-[#00AED6] text-2xl mr-4" />
                  <div>
                    <strong className="block text-primary">GoPay</strong>
                    <span className="text-xs text-text-muted">Bayar instan pakai aplikasi Gojek</span>
                  </div>
                </button>
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition-colors ${selectedMethod ? 'bg-primary text-surface hover:bg-accent' : 'bg-border text-text-muted cursor-not-allowed'}`}
                disabled={!selectedMethod}
                onClick={handlePayment}
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
