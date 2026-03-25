import mongoose, { Document } from 'mongoose';
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
        landOwnerShare: number;
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
export declare const JointVenture: mongoose.Model<IJointVenture, {}, {}, {}, mongoose.Document<unknown, {}, IJointVenture, {}, {}> & IJointVenture & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=jv.model.d.ts.map