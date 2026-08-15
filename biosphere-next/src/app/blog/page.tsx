import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Memahami Perbedaan Washed, Natural, dan Honey Process",
      excerpt: "Cara pasca-panen sangat menentukan profil rasa akhir kopi Anda. Pelajari tiga proses utama yang sering Anda temukan di label kemasan.",
      date: "12 Ags 2026",
      category: "Edukasi",
      image: "/images/blog_drying_1785061072954.jpg" // Using an existing image from old files
    },
    {
      id: 2,
      title: "Menjelajahi Kopi Dataran Tinggi Jawa Barat",
      excerpt: "Apa yang membuat kopi dari Gunung Puntang dan Ciwidey memiliki karakteristik rasa buah yang sangat kuat dan manis?",
      date: "05 Ags 2026",
      category: "Asal Usul",
      image: "/images/blog_farmer_1785061103352.jpg"
    }
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      <div className="bg-surface border-b border-border py-16 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-heading mb-4">
          Jurnal & Edukasi Kopi
        </h1>
        <p className="text-text-muted text-lg max-w-[700px] mx-auto px-6">
          Tulisan dari tim kami tentang ilmu di balik seduhan, cerita petani, dan tips menyeduh kopi di rumah.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-surface rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-[200px] overflow-hidden relative bg-border">
                {/* Fallback styling for images to ensure they look okay even if the path fails */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.image})`, backgroundColor: 'var(--color-secondary)' }}
                ></div>
                <span className="absolute top-4 left-4 bg-accent text-surface px-3 py-1 text-xs font-bold rounded-full z-10">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-text-muted mb-2">{post.date}</p>
                <h3 className="font-heading font-bold text-xl text-primary mb-3 leading-tight group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-text-muted text-sm mb-5 flex-grow">
                  {post.excerpt}
                </p>
                <Link href="#" className="text-primary font-bold text-sm flex items-center gap-2 hover:text-accent transition-colors mt-auto w-fit">
                  Baca Selengkapnya &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
