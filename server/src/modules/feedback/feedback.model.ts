import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  from: mongoose.Types.ObjectId;
  entityType: 'Property' | 'User' | 'LegalCase' | 'PackersBooking' | 'Campaign';
  entityId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    entityType: {
      type: String,
      enum: ['Property', 'User', 'LegalCase', 'PackersBooking', 'Campaign'],
      required: true,
      index: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, maxlength: 1000 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

feedbackSchema.index({ entityType: 1, entityId: 1 });
feedbackSchema.index({ from: 1, entityType: 1, entityId: 1 }, { unique: true });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
