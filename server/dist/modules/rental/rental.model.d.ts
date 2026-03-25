import mongoose, { Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';
export interface IRentalAgreement extends Document {
    property: mongoose.Types.ObjectId;
    landlord: mongoose.Types.ObjectId;
    tenant: mongoose.Types.ObjectId;
    monthlyRent: number;
    securityDeposit: number;
    leaseStart: Date;
    leaseEnd: Date;
    status: GlobalStatus;
    terms: string;
    documents: mongoose.Types.ObjectId[];
    renewalHistory: {
        renewedOn: Date;
        newEnd: Date;
        newRent: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const RentalAgreement: mongoose.Model<IRentalAgreement, {}, {}, {}, mongoose.Document<unknown, {}, IRentalAgreement, {}, {}> & IRentalAgreement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=rental.model.d.ts.map