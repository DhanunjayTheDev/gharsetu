import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../shared/types';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    entityType?: string;
    entityId?: string;
    link?: string;
  };
  isRead: boolean;
  readAt?: Date;
  emailSent: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
    data: {
      entityType: String,
      entityId: String,
      link: String,
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
