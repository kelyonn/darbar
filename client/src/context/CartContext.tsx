import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface AddOptions {
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, options?: AddOptions) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const lineKey = (id: string, size?: string, color?: string) => `${id}|${size ?? ''}|${color ?? ''}`;

interface ServerCartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

const fromServer = (i: ServerCartItem): CartItem => ({
  id: i.productId,
  lineId: i._id,
  name: i.name,
  price: i.price,
  description: '',
  category: 'womens',
  images: [i.image],
  size: i.size,
  color: i.color,
  quantity: i.quantity,
});

// Guests keep their cart in localStorage; signed-in users have a server-side cart
// (the server builds orders from it), which guest items are merged into on login.
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const loadServerCart = useCallback(async () => {
    const { data } = await api.get('/cart');
    setItems((data.cart?.items || []).map(fromServer));
  }, []);

  // Guest persistence
  useEffect(() => {
    if (!userId) {
      try { localStorage.setItem('cart', JSON.stringify(items)); } catch { /* ignore */ }
    }
  }, [items, userId]);

  // Login / logout transitions
  useEffect(() => {
    if (isLoading) return;
    if (!userId) {
      // Signed out: drop any server-backed lines (they carry a server lineId).
      setItems(cur => cur.filter(i => i.lineId?.includes('|')));
      return;
    }
    (async () => {
      try {
        const guestLines = itemsRef.current.filter(i => i.lineId?.includes('|') || !i.lineId);
        for (const g of guestLines) {
          await api.post('/cart', { productId: g.id, quantity: g.quantity, size: g.size, color: g.color }).catch(() => undefined);
        }
        if (guestLines.length) localStorage.removeItem('cart');
        await loadServerCart();
      } catch {
        /* keep whatever we have */
      }
    })();
  }, [userId, isLoading, loadServerCart]);

  const addToCart = (product: Product, options: AddOptions = {}) => {
    const { size, color } = options;
    const id = product.id;
    if (userId) {
      api.post('/cart', { productId: id, quantity: 1, size, color }).then(loadServerCart).catch(() => undefined);
    }
    setItems(current => {
      const key = lineKey(id, size, color);
      const existing = current.find(i => (i.lineId ?? lineKey(i.id, i.size, i.color)) === key);
      if (existing) {
        return current.map(i => (i === existing ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...current, { ...product, quantity: 1, size, color, lineId: key }];
    });
  };

  const removeFromCart = (lineId: string) => {
    setItems(current => current.filter(i => i.lineId !== lineId));
    if (userId && !lineId.includes('|')) {
      api.delete(`/cart/${lineId}`).catch(() => loadServerCart());
    }
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    setItems(current =>
      current
        .map(i => (i.lineId === lineId ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter(i => i.quantity > 0)
    );
    if (userId && !lineId.includes('|')) {
      api.put(`/cart/${lineId}`, { quantity }).catch(() => loadServerCart());
    }
  };

  const clearCart = () => {
    setItems([]);
    try { localStorage.removeItem('cart'); } catch { /* ignore */ }
    if (userId) api.delete('/cart').catch(() => undefined);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
