import mongoose, { Schema, Document } from 'mongoose';
import { DocumentStatus } from '../../shared/types';

export interface IDocument extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  cloudinaryId?: string;
  uploadedBy: mongoose.Types.ObjectId;
  status: DocumentStatus;
  relatedEntity: {
    entityType: 'Property' | 'LegalCase' | 'JointVenture' | 'RentalAgreement' | 'User';
    entityId: mongoose.Types.ObjectId;
  };
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 500 },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    cloudinaryId: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.UPLOADED,
      index: true,
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['Property', 'LegalCase', 'JointVenture', 'RentalAgreement', 'User'],
        required: true,
      },
      entityId: { type: Schema.Types.ObjectId, required: true },
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

documentSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
