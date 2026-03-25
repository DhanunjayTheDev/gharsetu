import mongoose, { Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';
export interface IPropertyManagement extends Document {
    property: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    manager: mongoose.Types.ObjectId;
    status: GlobalStatus;
    monthlyFee: number;
    services: ('rent_collection' | 'maintenance' | 'tenant_screening' | 'inspections')[];
    rentTracking: {
        month: string;
        amount: number;
        collected: boolean;
        collectedAt?: Date;
    }[];
    maintenanceRequests: {
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        status: GlobalStatus;
        cost?: number;
        createdAt: Date;
        resolvedAt?: Date;
    }[];
    contractStart: Date;
    contractEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PropertyManagement: mongoose.Model<IPropertyManagement, {}, {}, {}, mongoose.Document<unknown, {}, IPropertyManagement, {}, {}> & IPropertyManagement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=propertyManagement.model.d.ts.map