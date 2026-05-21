import mongoose, { Document, Schema } from 'mongoose';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  maxUses: number;
  usedCount: number;
  applicableCategories: string[];
  sellerId?: mongoose.Types.ObjectId;
  isFirstOrderOnly: boolean;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true,
    },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: Number,
    maxUses: { type: Number, default: Infinity },
    usedCount: { type: Number, default: 0 },
    applicableCategories: [String],
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    isFirstOrderOnly: { type: Boolean, default: false },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
