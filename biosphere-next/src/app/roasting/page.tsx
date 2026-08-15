import { FaFireBurner, FaTemperatureHalf, FaMicroscope } from 'react-icons/fa6';
import Link from 'next/link';

export default function RoastingPage() {
  return (
    <div className="bg-bg-main min-h-screen">
      <div className="bg-surface border-b border-border py-16 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-heading mb-4">
          Fasilitas Roasting
        </h1>
        <p className="text-text-muted text-lg max-w-[700px] mx-auto px-6">
          Mesin modern, profil sangrai yang dikalibrasi secara presisi, dan Quality Control (QC) ketat untuk menghasilkan rasa yang konsisten pada setiap batch.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl mb-6">
              <FaFireBurner />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary mb-3">Mesin Probat Terkini</h3>
            <p className="text-text-muted">
              Kami menggunakan mesin roasting kaliber dunia untuk menjamin sirkulasi panas dan aliran udara (airflow) yang stabil di seluruh drum.
            </p>
          </div>
          
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center text-3xl mb-6">
              <FaTemperatureHalf />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary mb-3">Suhu Terukur Presisi</h3>
            <p className="text-text-muted">
              Kurva roasting dipantau secara real-time via software terkomputerisasi untuk mengekstraksi sweet spot dari setiap jenis biji kopi.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center text-3xl mb-6">
              <FaMicroscope />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary mb-3">Cupping & QC Ketat</h3>
            <p className="text-text-muted">
              Setiap hasil sangraian melalui proses cupping ketat untuk memastikan tidak ada cacat rasa (defect) sebelum dikemas ke tangan Anda.
            </p>
          </div>
        </div>

        <div className="bg-surface p-10 rounded-2xl shadow-md border border-border flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-primary font-heading mb-4">Ingin Maklon Roasting?</h2>
            <p className="text-text-muted text-lg">
              Kami membuka layanan toll-roasting (maklon) untuk kedai kopi, restoran, atau merek kopi Anda sendiri. Konsultasikan profil rasa impian Anda dengan head roaster kami.
            </p>
          </div>
          <Link href="/kontak" className="bg-accent text-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors whitespace-nowrap">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
