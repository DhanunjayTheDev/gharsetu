import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface IRentalAgreement extends Document {
  property: mongoose.Types.ObjectId;
  landlord: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  monthlyRent: number;
  securityDeposit: number;
  leaseStart: Date;
  leaseEnd: Date;
  status: GlobalStatus;
  terms: string;
  documents: mongoose.Types.ObjectId[];
  renewalHistory: {
    renewedOn: Date;
    newEnd: Date;
    newRent: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRentalAgreement>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    leaseStart: { type: Date, required: true },
    leaseEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    terms: { type: String, maxlength: 5000 },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    renewalHistory: [
      {
        renewedOn: Date,
        newEnd: Date,
        newRent: Number,
      },
    ],
  },
  { timestamps: true }
);

export const RentalAgreement = mongoose.model<IRentalAgreement>('RentalAgreement', rentalSchema);
