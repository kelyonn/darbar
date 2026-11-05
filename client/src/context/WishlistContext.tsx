import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    try { localStorage.setItem('wishlist', JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  // Signed-in users have a server-side wishlist; merge local items into it on login.
  useEffect(() => {
    if (isLoading || !userId) return;
    (async () => {
      try {
        const { data } = await api.get('/wishlist');
        const server: Product[] = (data.products || []).map((p: any) => ({ ...p, id: p._id }));
        const serverIds = new Set(server.map(p => p.id));
        const extra = itemsRef.current.filter(p => !serverIds.has(p.id));
        for (const p of extra) await api.post(`/wishlist/${p.id}`).catch(() => undefined);
        setItems([...server, ...extra]);
      } catch { /* keep local */ }
    })();
  }, [userId, isLoading]);

  const addToWishlist = (product: Product) => {
    if (userId && !itemsRef.current.some(i => i.id === product.id)) {
      api.post(`/wishlist/${product.id}`).catch(() => undefined);
    }
    setItems(currentItems => {
      if (!currentItems.find(item => item.id === product.id)) {
        return [...currentItems, product];
      }
      return currentItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    if (userId && itemsRef.current.some(i => i.id === productId)) {
      api.post(`/wishlist/${productId}`).catch(() => undefined);
    }
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};