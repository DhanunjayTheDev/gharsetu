import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface IPackersBooking extends Document {
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  status: GlobalStatus;
  pickupAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  dropAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  scheduledDate: Date;
  scheduledTime: string;
  items: {
    name: string;
    quantity: number;
    category: string;
  }[];
  estimatedCost: number;
  finalCost?: number;
  vehicleType: 'mini' | 'small' | 'medium' | 'large';
  specialInstructions?: string;
  rating?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const packersSchema = new Schema<IPackersBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    pickupAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    dropAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    items: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      category: String,
    }],
    estimatedCost: { type: Number, required: true },
    finalCost: Number,
    vehicleType: {
      type: String,
      enum: ['mini', 'small', 'medium', 'large'],
      default: 'medium',
    },
    specialInstructions: String,
    rating: { type: Number, min: 1, max: 5 },
    completedAt: Date,
  },
  { timestamps: true }
);

export const PackersBooking = mongoose.model<IPackersBooking>('PackersBooking', packersSchema);
