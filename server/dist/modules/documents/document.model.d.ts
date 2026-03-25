import mongoose, { Document } from 'mongoose';
import { DocumentStatus } from '../../shared/types';
export interface IDocument extends Document {
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    cloudinaryId?: string;
    uploadedBy: mongoose.Types.ObjectId;
    status: DocumentStatus;
    relatedEntity: {
        entityType: 'Property' | 'LegalCase' | 'JointVenture' | 'RentalAgreement' | 'User';
        entityId: mongoose.Types.ObjectId;
    };
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DocumentModel: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, {}> & IDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=document.model.d.ts.map