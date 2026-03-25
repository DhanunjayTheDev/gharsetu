import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface IOffer extends Document {
  property: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  offerPrice: number;
  counterPrice?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  negotiationThread: {
    from: mongoose.Types.ObjectId;
    message: string;
    price?: number;
    createdAt: Date;
  }[];
  visitScheduled?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    offerPrice: { type: Number, required: true },
    counterPrice: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered', 'withdrawn'],
      default: 'pending',
      index: true,
    },
    negotiationThread: [
      {
        from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        price: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    visitScheduled: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    notes: String,
  },
  { timestamps: true }
);

export const Offer = mongoose.model<IOffer>('Offer', offerSchema);
