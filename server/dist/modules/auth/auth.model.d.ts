import mongoose, { Document } from 'mongoose';
import { UserRole } from '../../shared/types';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    isVerified: boolean;
    kyc: {
        status: 'pending' | 'submitted' | 'verified' | 'rejected';
        documents: string[];
        verifiedAt?: Date;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    preferences?: {
        language: string;
        notifications: {
            email: boolean;
            inApp: boolean;
        };
    };
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=auth.model.d.ts.map