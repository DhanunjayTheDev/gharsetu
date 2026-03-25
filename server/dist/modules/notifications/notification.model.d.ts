import mongoose, { Document } from 'mongoose';
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
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=notification.model.d.ts.map