import { IProperty } from './property.model';
import { CreatePropertyInput, UpdatePropertyInput } from './property.validation';
import { PropertyStatus } from '../../shared/types';
interface PropertyFilters {
    type?: string;
    purpose?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    search?: string;
    lat?: number;
    lng?: number;
    radius?: number;
}
export declare const propertyService: {
    create(ownerId: string, input: CreatePropertyInput): Promise<import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters: PropertyFilters, page: number, limit: number): Promise<{
        properties: (import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<any>;
    update(id: string, userId: string, userRole: string, input: UpdatePropertyInput): Promise<import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string, userId: string, userRole: string): Promise<import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyProperties(userId: string, page: number, limit: number): Promise<{
        properties: (import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    updateStatus(id: string, status: PropertyStatus): Promise<import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getNearby(lat: number, lng: number, radiusKm?: number, limit?: number): Promise<(import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getFeatured(limit?: number): Promise<(import("mongoose").Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
};
export {};
//# sourceMappingURL=property.service.d.ts.map