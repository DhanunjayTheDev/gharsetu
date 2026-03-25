import mongoose, { Schema, Document } from 'mongoose';
import { ScheduleType, GlobalStatus } from '../../shared/types';

export interface ISchedule extends Document {
  type: ScheduleType;
  title: string;
  description?: string;
  organizer: mongoose.Types.ObjectId;
  attendee: mongoose.Types.ObjectId;
  relatedEntity: {
    entityType: 'Property' | 'LegalCase' | 'PackersBooking' | 'PropertyManagement';
    entityId: mongoose.Types.ObjectId;
  };
  date: Date;
  startTime: string;
  endTime: string;
  status: GlobalStatus;
  location?: string;
  meetingLink?: string;
  notes?: string;
  cancellationReason?: string;
  reminder: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    type: { type: String, enum: Object.values(ScheduleType), required: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attendee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    relatedEntity: {
      entityType: { type: String, enum: ['Property', 'LegalCase', 'PackersBooking', 'PropertyManagement'] },
      entityId: { type: Schema.Types.ObjectId },
    },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(GlobalStatus),
      default: GlobalStatus.PENDING,
      index: true,
    },
    location: String,
    meetingLink: String,
    notes: String,
    cancellationReason: String,
    reminder: { type: Boolean, default: true },
    reminderSentAt: Date,
  },
  { timestamps: true }
);

scheduleSchema.index({ date: 1, organizer: 1 });
scheduleSchema.index({ date: 1, attendee: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
