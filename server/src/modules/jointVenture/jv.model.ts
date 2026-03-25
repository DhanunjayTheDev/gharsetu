import mongoose, { Schema, Document } from 'mongoose';
import { JVStage, GlobalStatus } from '../../shared/types';

export interface IJointVenture extends Document {
  title: string;
  description: string;
  landowner: mongoose.Types.ObjectId;
  builder: mongoose.Types.ObjectId;
  property?: mongoose.Types.ObjectId;
  stage: JVStage;
  status: GlobalStatus;
  landDetails: {
    area: number;
    areaUnit: string;
    location: string;
    surveyNumber?: string;
  };
  terms: {
    landOwnerShare: number; // percentage
    builderShare: number;
    estimatedUnits: number;
    estimatedCost: number;
    timeline: string;
  };
  documents: mongoose.Types.ObjectId[];
  milestones: {
    title: string;
    description: string;
    targetDate: Date;
    completedDate?: Date;
    status: GlobalStatus;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const jvSchema = new Schema<IJointVenture>(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 5000 },
    landowner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    builder: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    stage: {
      type: String,
      enum: Object.values(JVStage),
      default: JVStage.PROPOSAL,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
    },
    landDetails: {
      area: { type: Number, required: true },
      areaUnit: { type: String, default: 'sqft' },
      location: { type: String, required: true },
      surveyNumber: String,
    },
    terms: {
      landOwnerShare: { type: Number, required: true },
      builderShare: { type: Number, required: true },
      estimatedUnits: Number,
      estimatedCost: Number,
      timeline: String,
    },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    milestones: [{
      title: { type: String, required: true },
      description: String,
      targetDate: Date,
      completedDate: Date,
      status: { type: String, enum: Object.values(GlobalStatus), default: GlobalStatus.PENDING },
    }],
  },
  { timestamps: true }
);

export const JointVenture = mongoose.model<IJointVenture>('JointVenture', jvSchema);
