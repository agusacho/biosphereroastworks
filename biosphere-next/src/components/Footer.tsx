import Link from 'next/link';
import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto pt-[60px]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div className="footer-col">
          <h3 className="text-xl font-extrabold text-primary mb-5 tracking-tight font-heading">
            Biosphere Roast Works
          </h3>
          <p className="text-text-muted text-[0.95rem] leading-relaxed mb-5">
            Memadukan presisi sains dengan seni sangrai untuk menghasilkan kopi berkualitas terbaik.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-main text-primary border border-border transition-all hover:bg-accent hover:text-surface hover:border-accent hover:-translate-y-1">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-main text-primary border border-border transition-all hover:bg-accent hover:text-surface hover:border-accent hover:-translate-y-1">
              <FaTiktok />
            </a>
            <a href="https://wa.me/6282123456789" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-main text-primary border border-border transition-all hover:bg-accent hover:text-surface hover:border-accent hover:-translate-y-1">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="text-xl font-extrabold text-primary mb-5 tracking-tight font-heading">
            Menu Cepat
          </h3>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/produk" className="text-text-muted text-[0.95rem] transition-all hover:text-accent hover:translate-x-1 inline-block">
                Belanja Kopi
              </Link>
            </li>
            <li>
              <Link href="/roasting" className="text-text-muted text-[0.95rem] transition-all hover:text-accent hover:translate-x-1 inline-block">
                Fasilitas Roasting
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="text-text-muted text-[0.95rem] transition-all hover:text-accent hover:translate-x-1 inline-block">
                Hubungi Kami
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="text-xl font-extrabold text-primary mb-5 tracking-tight font-heading">
            Pemesanan & Kerjasama
          </h3>
          <ul className="flex flex-col gap-3 text-text-muted text-[0.95rem]">
            <li className="flex items-center gap-2">
              <FaWhatsapp className="text-accent w-4" /> 
              <span>0821-2345-6789</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-accent w-4" /> 
              <span>hello@biosphereroast.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-bg-main py-5 px-6 text-center border-t border-border">
        <p className="text-text-muted text-[0.85rem] m-0">
          &copy; 2026 Biosphere Roast Works. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
