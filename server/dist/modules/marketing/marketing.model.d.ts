import mongoose, { Document } from 'mongoose';
import { GlobalStatus } from '../../shared/types';
export interface ICampaign extends Document {
    title: string;
    description: string;
    property?: mongoose.Types.ObjectId;
    partner: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    type: 'project_listing' | 'lead_generation' | 'brand_promotion' | 'digital_marketing';
    status: GlobalStatus;
    budget: number;
    startDate: Date;
    endDate: Date;
    analytics: {
        impressions: number;
        clicks: number;
        leads: number;
        conversions: number;
    };
    leads: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Campaign: mongoose.Model<ICampaign, {}, {}, {}, mongoose.Document<unknown, {}, ICampaign, {}, {}> & ICampaign & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=marketing.model.d.ts.map