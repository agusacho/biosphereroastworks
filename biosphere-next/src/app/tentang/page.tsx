import { FaLeaf, FaHandshake, FaMountainSun } from 'react-icons/fa6';

export default function TentangPage() {
  return (
    <div className="bg-bg-main min-h-screen">
      <div className="bg-surface border-b border-border py-16 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-heading mb-4">
          Where Science Meets Soul
        </h1>
        <p className="text-text-muted text-lg max-w-[700px] mx-auto px-6">
          Biosphere Roast Works lahir dari dedikasi untuk memahami kopi tidak hanya sebagai minuman, tetapi sebagai entitas biologis dan kimiawi yang kompleks.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-extrabold mb-6 font-heading text-primary">
              Filosofi Kami
            </h2>
            <p className="mb-4 text-text-muted leading-relaxed">
              Kami percaya bahwa sangrai kopi yang luar biasa bukanlah sekadar seni, melainkan ilmu pengetahuan yang dapat diukur dan direplikasi.
            </p>
            <p className="mb-8 text-text-muted leading-relaxed">
              Perjalanan kami dimulai di dataran tinggi Jawa Barat, bekerja berdampingan dengan petani lokal untuk memastikan setiap ceri kopi dipanen pada puncak kematangannya.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-border text-primary font-bold text-sm shadow-sm">
                <FaLeaf className="text-success" /> 100% Organic
              </div>
              <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-border text-primary font-bold text-sm shadow-sm">
                <FaHandshake className="text-accent" /> Fair Trade
              </div>
            </div>
          </div>
          
          <div className="h-[400px] rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
            <div className="text-center text-surface">
              <FaMountainSun className="text-6xl mb-4 mx-auto opacity-90" />
              <span className="font-bold text-xl tracking-wide">Dataran Tinggi Jawa Barat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
