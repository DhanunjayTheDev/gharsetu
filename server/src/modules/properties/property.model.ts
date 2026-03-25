import mongoose, { Schema, Document } from 'mongoose';
import { PropertyType, PropertyPurpose, PropertyStatus } from '../../shared/types';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  owner: mongoose.Types.ObjectId;
  price: number;
  priceUnit: 'total' | 'per_sqft' | 'per_month';
  area: {
    value: number;
    unit: 'sqft' | 'sqm' | 'acres' | 'hectares';
  };
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;
  furnishing?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  amenities: string[];
  images: string[];
  documents: mongoose.Types.ObjectId[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    state: string;
    pincode: string;
    locality: string;
    landmark?: string;
  };
  features: {
    parking: boolean;
    garden: boolean;
    pool: boolean;
    gym: boolean;
    security: boolean;
    elevator: boolean;
    powerBackup: boolean;
    waterSupply: boolean;
  };
  verification: {
    isVerified: boolean;
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    legalCaseId?: mongoose.Types.ObjectId;
  };
  views: number;
  inquiryCount: number;
  isFeatured: boolean;
  availableFrom?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    type: { type: String, enum: Object.values(PropertyType), required: true, index: true },
    purpose: { type: String, enum: Object.values(PropertyPurpose), required: true, index: true },
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.DRAFT,
      index: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price: { type: Number, required: true, index: true },
    priceUnit: { type: String, enum: ['total', 'per_sqft', 'per_month'], default: 'total' },
    area: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['sqft', 'sqm', 'acres', 'hectares'], default: 'sqft' },
    },
    bedrooms: Number,
    bathrooms: Number,
    floors: Number,
    yearBuilt: Number,
    furnishing: { type: String, enum: ['unfurnished', 'semi_furnished', 'fully_furnished'] },
    amenities: [String],
    images: [String],
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
      pincode: { type: String, required: true },
      locality: { type: String, index: true },
      landmark: String,
    },
    features: {
      parking: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      waterSupply: { type: Boolean, default: false },
    },
    verification: {
      isVerified: { type: Boolean, default: false },
      verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date,
      legalCaseId: { type: Schema.Types.ObjectId, ref: 'LegalCase' },
    },
    views: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    availableFrom: Date,
  },
  { timestamps: true }
);

// GeoJSON index for location-based search
propertySchema.index({ 'location.coordinates': '2dsphere' });
// Compound indexes for common queries
propertySchema.index({ purpose: 1, type: 1, status: 1, price: 1 });
propertySchema.index({ 'location.city': 1, purpose: 1, status: 1 });
// Text search index
propertySchema.index({ title: 'text', description: 'text', 'location.address': 'text', 'location.locality': 'text' });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
