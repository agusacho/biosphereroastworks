"use client";
import { FaEye, FaCartPlus, FaStar, FaRegStar } from 'react-icons/fa6';

interface ProductVariant {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  variants?: ProductVariant[];
  imageStyle?: string;
  rating?: number;
  notes?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetail }: ProductCardProps) {
  const hasVariants = product.variants && product.variants.length > 0;
  const price = hasVariants ? product.variants![0].price : (product.price || 0);
  
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const badgeColors: Record<string, string> = {
    'green': 'bg-success text-white',
    'roasted': 'bg-accent text-white',
    'drink': 'bg-primary text-white',
    'default': 'bg-primary text-white'
  };

  const getBadgeColor = (cat: string) => badgeColors[cat] || badgeColors['default'];
  
  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-accent" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-accent opacity-50" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden transition-all hover:-translate-y-2 hover:shadow-md flex flex-col group h-full">
      <div 
        className="relative h-[250px] w-full flex flex-col items-center justify-center p-5 cursor-pointer overflow-hidden bg-gradient-to-br from-border to-white"
        onClick={() => onViewDetail && onViewDetail(product)}
      >
        <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider z-10 shadow-sm ${getBadgeColor(product.category)}`}>
          {product.category === 'drink' ? 'Minuman Kopi' : product.category}
        </span>
        
        <div className="text-primary font-heading font-bold text-2xl text-center opacity-80 z-0">
          {product.name.split(' ').slice(0, 2).join(' ')}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-[rgba(8,33,31,0.85)] to-transparent flex gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
          <button 
            className="flex-1 py-2 px-3 bg-transparent text-white border border-white/30 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(product); }}
          >
            <FaEye /> Detail
          </button>
          <button 
            className="flex-1 py-2 px-3 bg-primary text-white border border-primary rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-secondary transition-colors shadow-sm"
            onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
          >
            <FaCartPlus /> {hasVariants ? 'Pilih' : 'Tambah'}
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-heading font-extrabold text-primary text-xl mb-2">{product.name}</h3>
        <p className="text-text-muted text-sm mb-3 min-h-[40px]">{product.notes || ''}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            {hasVariants && <div className="text-xs text-text-muted">Mulai dari</div>}
            <div className="font-bold text-lg text-accent">{formatRupiah(price)}</div>
          </div>
          
          <button 
            className="flex items-center gap-2 bg-primary text-surface px-3 py-2 rounded-lg text-sm font-bold hover:bg-accent hover:shadow-md transition-all hover:-translate-y-1"
            onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
          >
            <FaCartPlus /> {hasVariants ? 'Pilih' : 'Beli'}
          </button>
        </div>
      </div>
    </div>
  );
}
