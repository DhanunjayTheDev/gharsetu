import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../shared/types';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  kyc: {
    status: 'pending' | 'submitted' | 'verified' | 'rejected';
    documents: string[];
    verifiedAt?: Date;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  preferences?: {
    language: string;
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.BUYER,
      index: true,
    },
    avatar: String,
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
    kyc: {
      status: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending',
      },
      documents: [String],
      verifiedAt: Date,
    },
    address: {
      street: String,
      city: { type: String, index: true },
      state: { type: String, index: true },
      pincode: String,
      country: { type: String, default: 'India' },
    },
    preferences: {
      language: { type: String, default: 'en' },
      notifications: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
    },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { password, refreshToken, resetPasswordToken, resetPasswordExpires, __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export const User = mongoose.model<IUser>('User', userSchema);
