import mongoose, { Document } from 'mongoose';
import { GlobalStatus, LegalCaseType } from '../../shared/types';
export interface ILegalCase extends Document {
    type: LegalCaseType;
    client: mongoose.Types.ObjectId;
    advisor: mongoose.Types.ObjectId;
    property?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: GlobalStatus;
    documents: mongoose.Types.ObjectId[];
    timeline: {
        event: string;
        description: string;
        date: Date;
        addedBy: mongoose.Types.ObjectId;
    }[];
    consultationDate?: Date;
    fee?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LegalCase: mongoose.Model<ILegalCase, {}, {}, {}, mongoose.Document<unknown, {}, ILegalCase, {}, {}> & ILegalCase & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=legal.model.d.ts.map