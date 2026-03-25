import mongoose, { Schema, Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';

export interface IPropertyManagement extends Document {
  property: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  status: GlobalStatus;
  monthlyFee: number;
  services: ('rent_collection' | 'maintenance' | 'tenant_screening' | 'inspections')[];
  rentTracking: {
    month: string;
    amount: number;
    collected: boolean;
    collectedAt?: Date;
  }[];
  maintenanceRequests: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: GlobalStatus;
    cost?: number;
    createdAt: Date;
    resolvedAt?: Date;
  }[];
  contractStart: Date;
  contractEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const propertyManagementSchema = new Schema<IPropertyManagement>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
    },
    monthlyFee: { type: Number, required: true },
    services: [{
      type: String,
      enum: ['rent_collection', 'maintenance', 'tenant_screening', 'inspections'],
    }],
    rentTracking: [{
      month: String,
      amount: Number,
      collected: { type: Boolean, default: false },
      collectedAt: Date,
    }],
    maintenanceRequests: [{
      title: { type: String, required: true },
      description: String,
      priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
      status: { type: String, enum: Object.values(GlobalStatus), default: GlobalStatus.PENDING },
      cost: Number,
      createdAt: { type: Date, default: Date.now },
      resolvedAt: Date,
    }],
    contractStart: { type: Date, required: true },
    contractEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PropertyManagement = mongoose.model<IPropertyManagement>('PropertyManagement', propertyManagementSchema);
