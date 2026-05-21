export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'mens' | 'womens' | 'accessories';
  images: string[];
  fabric?: string;
  colors?: string[];
  sizes?: string[];
  artisanStory?: string;
}

export interface CartItem extends Product {
  quantity: number;
}