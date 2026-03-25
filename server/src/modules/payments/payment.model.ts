import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus } from '../../shared/types';

export interface IPayment extends Document {
  payer: mongoose.Types.ObjectId;
  payee: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  description: string;
  status: PaymentStatus;
  type: 'service_fee' | 'commission' | 'rent' | 'deposit' | 'consultation_fee' | 'booking_fee';
  relatedEntity: {
    entityType: string;
    entityId: mongoose.Types.ObjectId;
  };
  transactionId?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    payer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    payee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.INITIATED,
      index: true,
    },
    type: {
      type: String,
      enum: ['service_fee', 'commission', 'rent', 'deposit', 'consultation_fee', 'booking_fee'],
      required: true,
      index: true,
    },
    relatedEntity: {
      entityType: String,
      entityId: Schema.Types.ObjectId,
    },
    transactionId: { type: String, unique: true, sparse: true },
    paymentMethod: String,
    metadata: Schema.Types.Mixed,
    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ payer: 1, status: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
