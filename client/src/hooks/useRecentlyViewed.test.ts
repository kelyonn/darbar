import { renderHook, act } from '@testing-library/react';
import { useRecentlyViewed } from './useRecentlyViewed';
import { vi } from 'vitest';

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { for (const key in store) delete store[key]; }),
      },
      writable: true,
    });
    window.localStorage.clear();
  });

  it('should initialize with an empty array if localStorage is empty', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.getItems()).toEqual([]);
  });

  it('should add an item to the recently viewed list', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    const mockItem = {
      id: '1',
      name: 'Product 1',
      slug: 'product-1',
      price: 100,
      image: 'img1.jpg',
    };

    act(() => {
      result.current.addItem(mockItem);
    });

    expect(result.current.getItems()).toEqual([mockItem]);
  });

  it('should not add duplicate items, instead move it to the front', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    const mockItem1 = { id: '1', name: 'Product 1', slug: 'product-1', price: 100, image: 'img1.jpg' };
    const mockItem2 = { id: '2', name: 'Product 2', slug: 'product-2', price: 200, image: 'img2.jpg' };

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
      result.current.addItem(mockItem1); // Add item 1 again
    });

    const items = result.current.getItems();
    expect(items.length).toBe(2);
    expect(items[0]).toEqual(mockItem1);
    expect(items[1]).toEqual(mockItem2);
  });

  it('should keep only the most recent MAX items', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    
    act(() => {
      for (let i = 1; i <= 10; i++) {
        result.current.addItem({
          id: i.toString(),
          name: `Product ${i}`,
          slug: `product-${i}`,
          price: i * 100,
          image: `img${i}.jpg`,
        });
      }
    });

    const items = result.current.getItems();
    // Assuming MAX is 8 based on implementation
    expect(items.length).toBe(8);
    // The last added item should be at the front
    expect(items[0].id).toBe('10');
    expect(items[7].id).toBe('3');
  });
});
