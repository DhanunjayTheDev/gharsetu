import mongoose, { Document } from 'mongoose';
import { PropertyType, PropertyPurpose, PropertyStatus } from '../../shared/types';
export interface IProperty extends Document {
    title: string;
    description: string;
    type: PropertyType;
    purpose: PropertyPurpose;
    status: PropertyStatus;
    owner: mongoose.Types.ObjectId;
    price: number;
    priceUnit: 'total' | 'per_sqft' | 'per_month';
    area: {
        value: number;
        unit: 'sqft' | 'sqm' | 'acres' | 'hectares';
    };
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    yearBuilt?: number;
    furnishing?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
    amenities: string[];
    images: string[];
    documents: mongoose.Types.ObjectId[];
    location: {
        type: 'Point';
        coordinates: [number, number];
        address: string;
        city: string;
        state: string;
        pincode: string;
        locality: string;
        landmark?: string;
    };
    features: {
        parking: boolean;
        garden: boolean;
        pool: boolean;
        gym: boolean;
        security: boolean;
        elevator: boolean;
        powerBackup: boolean;
        waterSupply: boolean;
    };
    verification: {
        isVerified: boolean;
        verifiedBy?: mongoose.Types.ObjectId;
        verifiedAt?: Date;
        legalCaseId?: mongoose.Types.ObjectId;
    };
    views: number;
    inquiryCount: number;
    isFeatured: boolean;
    availableFrom?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Property: mongoose.Model<IProperty, {}, {}, {}, mongoose.Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=property.model.d.ts.map