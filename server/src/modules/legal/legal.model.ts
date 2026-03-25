import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus, LegalCaseType } from '../../shared/types';

export interface ILegalCase extends Document {
  type: LegalCaseType;
  client: mongoose.Types.ObjectId;
  advisor: mongoose.Types.ObjectId;
  property?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: GlobalStatus;
  documents: mongoose.Types.ObjectId[];
  timeline: {
    event: string;
    description: string;
    date: Date;
    addedBy: mongoose.Types.ObjectId;
  }[];
  consultationDate?: Date;
  fee?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const legalCaseSchema = new Schema<ILegalCase>(
  {
    type: { type: String, enum: Object.values(LegalCaseType), required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    advisor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    timeline: [{
      event: { type: String, required: true },
      description: String,
      date: { type: Date, default: Date.now },
      addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    consultationDate: Date,
    fee: Number,
    notes: String,
  },
  { timestamps: true }
);

export const LegalCase = mongoose.model<ILegalCase>('LegalCase', legalCaseSchema);
