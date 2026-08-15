"use client";
import { useEffect, useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { FaFilter } from 'react-icons/fa6';

import { useCartStore } from '@/store/useCartStore';

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Parse variants from JSON if needed
          const formattedProducts = data.map(p => ({
            ...p,
            variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants,
          }));
          setProducts(formattedProducts);
        } else {
          // Fallback if empty
          setProducts([
            { id: 'p1', name: 'Gayo Aceh', category: 'green', price: 95000, notes: 'Floral, fruity, clean' },
            { id: 'p2', name: 'Bali Kintamani', category: 'roasted', price: 110000, variants: [{name: '250g', price: 110000}] },
          ]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        // Fallback
        setProducts([
          { id: 'p1', name: 'Gayo Aceh', category: 'green', price: 95000, notes: 'Floral, fruity, clean' },
          { id: 'p2', name: 'Bali Kintamani', category: 'roasted', price: 110000, variants: [{name: '250g', price: 110000}] },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const hasVariants = product.variants && product.variants.length > 0;
    
    addItem({
      product,
      quantity: 1,
      selectedVariant: hasVariants ? product.variants![0].name : undefined,
      price: hasVariants ? product.variants![0].price : (product.price || 0)
    });
  };

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  return (
    <div className="bg-bg-main min-h-screen pb-20">
      <div className="bg-surface border-b border-border py-12 mb-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold text-primary font-heading mb-4">
            Koleksi Kopi Kami
          </h1>
          <p className="text-text-muted text-lg max-w-[600px] mx-auto">
            Dari biji hijau (green beans) pilihan hingga hasil sangrai (roasted beans) terbaik, temukan profil rasa yang sesuai dengan selera Anda.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-[250px] flex-shrink-0">
          <div className="bg-surface rounded-xl p-5 border border-border shadow-sm sticky top-[100px]">
            <h3 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <FaFilter /> Kategori
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${categoryFilter === 'all' ? 'bg-primary text-surface font-bold' : 'hover:bg-bg-main text-text-muted'}`}
                  onClick={() => setCategoryFilter('all')}
                >
                  Semua Produk
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${categoryFilter === 'green' ? 'bg-primary text-surface font-bold' : 'hover:bg-bg-main text-text-muted'}`}
                  onClick={() => setCategoryFilter('green')}
                >
                  Green Beans
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${categoryFilter === 'roasted' ? 'bg-primary text-surface font-bold' : 'hover:bg-bg-main text-text-muted'}`}
                  onClick={() => setCategoryFilter('roasted')}
                >
                  Roasted Beans
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${categoryFilter === 'drink' ? 'bg-primary text-surface font-bold' : 'hover:bg-bg-main text-text-muted'}`}
                  onClick={() => setCategoryFilter('drink')}
                >
                  Menu Minuman
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-surface rounded-2xl h-[400px] animate-pulse border border-border"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onViewDetail={handleAddToCart}
                />
              ))}
            </div>
          )}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">Tidak ada produk dalam kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
