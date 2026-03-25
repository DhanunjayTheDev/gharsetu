import mongoose, { Document } from 'mongoose';
import { PaymentStatus } from '../../shared/types';
export interface IPayment extends Document {
    payer: mongoose.Types.ObjectId;
    payee: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    description: string;
    status: PaymentStatus;
    type: 'service_fee' | 'commission' | 'rent' | 'deposit' | 'consultation_fee' | 'booking_fee';
    relatedEntity: {
        entityType: string;
        entityId: mongoose.Types.ObjectId;
    };
    transactionId?: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=payment.model.d.ts.map