import mongoose, { Document } from 'mongoose';
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
export declare const Feedback: mongoose.Model<IFeedback, {}, {}, {}, mongoose.Document<unknown, {}, IFeedback, {}, {}> & IFeedback & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=feedback.model.d.ts.map