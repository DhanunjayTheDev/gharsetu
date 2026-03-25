import mongoose, { Document } from 'mongoose';
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
export declare const Schedule: mongoose.Model<ISchedule, {}, {}, {}, mongoose.Document<unknown, {}, ISchedule, {}, {}> & ISchedule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=schedule.model.d.ts.map