import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory = 'mens' | 'womens' | 'accessories' | 'footwear';

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  subcategory: string;
  images: IProductImage[];
  fabric?: string;
  colors: string[];
  sizes: string[];
  specifications?: {
    weight?: string;
    careInstructions?: string;
    craftTechnique?: string;
    origin?: string;
  };
  artisanStory?: string;
  sellerId: mongoose.Types.ObjectId;
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  viewCount: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: {
      type: String,
      enum: ['mens', 'womens', 'accessories', 'footwear'],
      required: true,
    },
    subcategory: { type: String, required: true },
    images: [ProductImageSchema],
    fabric: String,
    colors: [String],
    sizes: [String],
    specifications: {
      weight: String,
      careInstructions: String,
      craftTechnique: String,
      origin: String,
    },
    artisanStory: String,
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    viewCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
