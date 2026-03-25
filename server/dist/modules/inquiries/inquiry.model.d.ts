import mongoose, { Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';
export interface IInquiry extends Document {
    property: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    message: string;
    type: 'buy' | 'rent' | 'visit' | 'general';
    status: GlobalStatus;
    response?: string;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Inquiry: mongoose.Model<IInquiry, {}, {}, {}, mongoose.Document<unknown, {}, IInquiry, {}, {}> & IInquiry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=inquiry.model.d.ts.map