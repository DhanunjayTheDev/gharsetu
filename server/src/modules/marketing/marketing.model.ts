import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface ICampaign extends Document {
  title: string;
  description: string;
  property?: mongoose.Types.ObjectId;
  partner: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  type: 'project_listing' | 'lead_generation' | 'brand_promotion' | 'digital_marketing';
  status: GlobalStatus;
  budget: number;
  startDate: Date;
  endDate: Date;
  analytics: {
    impressions: number;
    clicks: number;
    leads: number;
    conversions: number;
  };
  leads: {
    name: string;
    email: string;
    phone: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 5000 },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    partner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['project_listing', 'lead_generation', 'brand_promotion', 'digital_marketing'],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    budget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    analytics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      leads: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    leads: [{
      name: { type: String, required: true },
      email: String,
      phone: String,
      source: String,
      status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
        default: 'new',
      },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
