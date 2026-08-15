import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(
          (item) => item.product.id === newItem.product.id && item.selectedVariant === newItem.selectedVariant
        );
        
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item === existingItem
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
            isOpen: true,
          };
        }
        
        return { items: [...state.items, newItem], isOpen: true };
      }),
      
      removeItem: (productId, selectedVariant) => set((state) => ({
        items: state.items.filter(
          (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
        ),
      })),
      
      updateQuantity: (productId, quantity, selectedVariant) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(
              (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
            ),
          };
        }
        
        return {
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedVariant === selectedVariant
              ? { ...item, quantity }
              : item
          ),
        };
      }),
      
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'biosphere-cart-storage',
    }
  )
);
