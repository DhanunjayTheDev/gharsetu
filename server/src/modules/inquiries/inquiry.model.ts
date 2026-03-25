import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface IInquiry extends Document {
  property: mongoose.Types.ObjectId;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  message: string;
  type: 'buy' | 'rent' | 'visit' | 'general';
  status: GlobalStatus;
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: ['buy', 'rent', 'visit', 'general'], required: true },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    response: String,
    respondedAt: Date,
  },
  { timestamps: true }
);

inquirySchema.index({ from: 1, property: 1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);
