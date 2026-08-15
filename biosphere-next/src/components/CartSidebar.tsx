"use client";
import { useCartStore } from '@/store/useCartStore';
import { FaXmark, FaTrash } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  
  // To avoid hydration mismatch with Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(8,33,31,0.5)] z-[60] backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] max-w-full bg-surface shadow-2xl z-[70] transform transition-transform duration-400 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-bg-main">
          <h3 className="font-heading font-extrabold text-xl text-primary m-0">Keranjang Belanja</h3>
          <button 
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-danger hover:border-danger transition-colors shadow-sm"
            onClick={closeCart}
          >
            <FaXmark />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted">
              <p className="text-lg">Keranjang Anda kosong.</p>
              <button 
                className="mt-4 bg-primary text-surface px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors"
                onClick={closeCart}
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedVariant}-${index}`} className="flex gap-4 p-4 border border-border rounded-xl bg-bg-main relative">
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">{item.product.name}</h4>
                    {item.selectedVariant && (
                      <p className="text-xs text-text-muted mb-1">{item.selectedVariant}</p>
                    )}
                    <p className="font-bold text-accent mb-3">{formatRupiah(item.price)}</p>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        className="w-8 h-8 rounded-full border border-border bg-surface text-primary flex items-center justify-center font-bold hover:bg-border transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                      >
                        -
                      </button>
                      <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 rounded-full border border-border bg-surface text-primary flex items-center justify-center font-bold hover:bg-border transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="absolute top-4 right-4 text-text-muted hover:text-danger transition-colors"
                    onClick={() => removeItem(item.product.id, item.selectedVariant)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-bg-main mt-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-text-muted text-lg">Total:</span>
              <span className="font-extrabold text-2xl text-accent">{formatRupiah(getTotalPrice())}</span>
            </div>
            <Link 
              href="/checkout"
              className="w-full bg-primary text-surface py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-accent transition-all hover:-translate-y-1 shadow-md block text-center"
              onClick={closeCart}
            >
              Checkout Sekarang
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
