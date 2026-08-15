import Link from 'next/link';
import { FaMugHot, FaLeaf, FaHandshake, FaMountainSun } from 'react-icons/fa6';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[var(--color-bg-main)] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D1D8D6] via-white to-[#D1D8D6] opacity-60 z-0"></div>
        
        <div className="relative z-10 text-center max-w-[800px] px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 font-heading tracking-tight leading-tight">
            Single Origin Pilihan, Disangrai Setiap Pekan
          </h2>
          <p className="text-lg text-text-muted mb-8 leading-relaxed">
            Temukan profil rasa terbaik dari biji kopi terbaik yang diproses dengan presisi.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/produk" 
              className="bg-accent text-surface px-8 py-3 rounded-xl font-bold transition-all hover:bg-yellow-600 hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Jelajahi Koleksi
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 font-heading text-primary">
            Find Your Perfect Roast
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-[600px] mx-auto">
            Belum tahu mana yang cocok? Jawab dua pertanyaan singkat untuk menemukan kopi ideal Anda.
          </p>
          <button className="bg-accent text-surface px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-yellow-600 hover:-translate-y-1 shadow-md flex items-center gap-2 mx-auto">
            <FaMugHot /> Mulai Kuis
          </button>
        </div>
      </section>

      {/* Tentang Section */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-heading text-primary">
                Where Science Meets Soul
              </h2>
              <p className="mb-4 text-text-muted leading-relaxed">
                Biosphere Roast Works lahir dari dedikasi untuk memahami kopi tidak hanya sebagai minuman, tetapi sebagai entitas biologis dan kimiawi yang kompleks.
              </p>
              <p className="mb-8 text-text-muted leading-relaxed">
                Perjalanan kami dimulai di dataran tinggi Jawa Barat, bekerja berdampingan dengan petani lokal untuk memastikan setiap ceri kopi dipanen pada puncak kematangannya.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-bg-main px-4 py-2 rounded-full border border-border text-primary font-bold text-sm shadow-sm">
                  <FaLeaf className="text-success" /> 100% Organic
                </div>
                <div className="flex items-center gap-2 bg-bg-main px-4 py-2 rounded-full border border-border text-primary font-bold text-sm shadow-sm">
                  <FaHandshake className="text-accent" /> Fair Trade
                </div>
              </div>
            </div>
            
            <div className="h-[400px] rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
              <div className="text-center text-surface">
                <FaMountainSun className="text-6xl mb-4 mx-auto opacity-90" />
                <span className="font-bold text-xl tracking-wide">Perkebunan Mitra Kami</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
