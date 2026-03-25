import mongoose, { Document } from 'mongoose';
export interface IOffer extends Document {
    property: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    offerPrice: number;
    counterPrice?: number;
    status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
    negotiationThread: {
        from: mongoose.Types.ObjectId;
        message: string;
        price?: number;
        createdAt: Date;
    }[];
    visitScheduled?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Offer: mongoose.Model<IOffer, {}, {}, {}, mongoose.Document<unknown, {}, IOffer, {}, {}> & IOffer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=offer.model.d.ts.map