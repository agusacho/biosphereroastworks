import { FaWhatsapp, FaEnvelope, FaLocationDot } from 'react-icons/fa6';

export default function KontakPage() {
  return (
    <div className="bg-bg-main min-h-screen pb-20">
      <div className="bg-surface border-b border-border py-16 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-heading mb-4">
          Hubungi Kami
        </h1>
        <p className="text-text-muted text-lg max-w-[700px] mx-auto px-6">
          Punya pertanyaan tentang produk, pesanan grosir, atau layanan maklon? Kami siap membantu.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl flex-shrink-0">
              <FaWhatsapp />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-primary mb-1">WhatsApp</h3>
              <p className="text-text-muted text-sm mb-2">Respon cepat di jam kerja (Senin-Jumat, 09:00 - 17:00).</p>
              <a href="https://wa.me/6282123456789" target="_blank" rel="noopener noreferrer" className="font-bold text-accent hover:underline">
                0821-2345-6789
              </a>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl flex-shrink-0">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-primary mb-1">Email</h3>
              <p className="text-text-muted text-sm mb-2">Untuk penawaran kerjasama, maklon, atau urusan bisnis lainnya.</p>
              <a href="mailto:hello@biosphereroast.com" className="font-bold text-primary hover:underline">
                hello@biosphereroast.com
              </a>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center text-2xl flex-shrink-0">
              <FaLocationDot />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-primary mb-1">Fasilitas Roasting</h3>
              <p className="text-text-muted text-sm">
                Bandung, Jawa Barat, Indonesia<br/>
                (Kunjungan hanya berdasarkan perjanjian/appointment)
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
          <h2 className="text-2xl font-extrabold text-primary font-heading mb-6">Kirim Pesan</h2>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-text-muted mb-2">Nama Lengkap</label>
              <input type="text" id="name" className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Masukkan nama Anda" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-text-muted mb-2">Alamat Email</label>
              <input type="email" id="email" className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Masukkan email Anda" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-text-muted mb-2">Pesan</label>
              <textarea id="message" rows={4} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."></textarea>
            </div>
            <button type="button" className="bg-primary text-surface py-4 rounded-xl font-bold mt-2 hover:bg-accent transition-colors">
              Kirim Pesan
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
