import mongoose, { Document, Schema } from 'mongoose';

export interface ISellerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  description: string;
  gstin?: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rating: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

const SellerProfileSchema = new Schema<ISellerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    gstin: { type: String, trim: true },
    bankAccountName: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    bankIfsc: { type: String, required: true, uppercase: true },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SellerProfile = mongoose.model<ISellerProfile>('SellerProfile', SellerProfileSchema);
