import mongoose, { Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';
export interface IPackersBooking extends Document {
    customer: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    status: GlobalStatus;
    pickupAddress: {
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    dropAddress: {
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    scheduledDate: Date;
    scheduledTime: string;
    items: {
        name: string;
        quantity: number;
        category: string;
    }[];
    estimatedCost: number;
    finalCost?: number;
    vehicleType: 'mini' | 'small' | 'medium' | 'large';
    specialInstructions?: string;
    rating?: number;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PackersBooking: mongoose.Model<IPackersBooking, {}, {}, {}, mongoose.Document<unknown, {}, IPackersBooking, {}, {}> & IPackersBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=packers.model.d.ts.map