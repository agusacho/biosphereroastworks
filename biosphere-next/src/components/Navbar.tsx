"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaCartShopping, FaBars } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  
  // Hydration fix for Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => {
    return pathname === path ? "text-accent font-bold" : "text-primary font-bold hover:text-accent";
  };

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50 transition-all h-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.jpg" alt="Biosphere Roast Works Logo" className="h-10 w-auto" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li><Link href="/produk" className={`transition-colors text-[0.95rem] ${isActive('/produk')}`}>Produk</Link></li>
            <li><Link href="/tentang" className={`transition-colors text-[0.95rem] ${isActive('/tentang')}`}>Tentang Kami</Link></li>
            <li><Link href="/roasting" className={`transition-colors text-[0.95rem] ${isActive('/roasting')}`}>Proses Sangrai</Link></li>
            <li><Link href="/blog" className={`transition-colors text-[0.95rem] ${isActive('/blog')}`}>Blog</Link></li>
            <li><Link href="/kontak" className={`transition-colors text-[0.95rem] ${isActive('/kontak')}`}>Kontak</Link></li>
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex cursor-pointer text-[0.95rem] text-primary font-bold mr-2">
            <span className="text-accent">ID</span> <span className="mx-1 text-border">|</span> <span className="text-text-muted hover:text-accent transition-colors">EN</span>
          </div>
          
          <button className="text-[1.3rem] text-primary hover:text-accent transition-colors">
            <FaUser />
          </button>
          
          <button 
            className="relative text-[1.3rem] text-primary hover:text-accent transition-colors"
            onClick={openCart}
          >
            <FaCartShopping />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-surface text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[1.3rem] text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-surface shadow-md py-4 px-6 flex flex-col gap-4 border-t border-border">
          <Link href="/produk" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isActive('/produk')}`}>Produk</Link>
          <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isActive('/tentang')}`}>Tentang Kami</Link>
          <Link href="/roasting" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isActive('/roasting')}`}>Proses Sangrai</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isActive('/blog')}`}>Blog</Link>
          <Link href="/kontak" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isActive('/kontak')}`}>Kontak</Link>
        </div>
      )}
    </header>
  );
}
