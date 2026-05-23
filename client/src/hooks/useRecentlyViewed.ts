import { useEffect, useCallback } from 'react';

const KEY = 'darbar_recently_viewed';
const MAX = 8;

export interface RecentItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

export function useRecentlyViewed() {
  const getItems = useCallback((): RecentItem[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }, []);

  const addItem = useCallback((item: RecentItem) => {
    const items = getItems().filter(i => i.id !== item.id);
    items.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  }, [getItems]);

  return { getItems, addItem };
}
