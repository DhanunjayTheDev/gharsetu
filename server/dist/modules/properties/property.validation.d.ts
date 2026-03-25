import { z } from 'zod';
import { PropertyType, PropertyPurpose } from '../../shared/types';
export declare const createPropertySchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodNativeEnum<typeof PropertyType>;
    purpose: z.ZodNativeEnum<typeof PropertyPurpose>;
    price: z.ZodNumber;
    priceUnit: z.ZodOptional<z.ZodEnum<["total", "per_sqft", "per_month"]>>;
    area: z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodOptional<z.ZodEnum<["sqft", "sqm", "acres", "hectares"]>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    }, {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    }>;
    bedrooms: z.ZodOptional<z.ZodNumber>;
    bathrooms: z.ZodOptional<z.ZodNumber>;
    floors: z.ZodOptional<z.ZodNumber>;
    yearBuilt: z.ZodOptional<z.ZodNumber>;
    furnishing: z.ZodOptional<z.ZodEnum<["unfurnished", "semi_furnished", "fully_furnished"]>>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodObject<{
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        address: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        locality: z.ZodString;
        landmark: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    }, {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    }>;
    features: z.ZodOptional<z.ZodObject<{
        parking: z.ZodOptional<z.ZodBoolean>;
        garden: z.ZodOptional<z.ZodBoolean>;
        pool: z.ZodOptional<z.ZodBoolean>;
        gym: z.ZodOptional<z.ZodBoolean>;
        security: z.ZodOptional<z.ZodBoolean>;
        elevator: z.ZodOptional<z.ZodBoolean>;
        powerBackup: z.ZodOptional<z.ZodBoolean>;
        waterSupply: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    }, {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    }>>;
    availableFrom: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: PropertyType;
    description: string;
    title: string;
    purpose: PropertyPurpose;
    price: number;
    area: {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    };
    location: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    };
    priceUnit?: "total" | "per_sqft" | "per_month" | undefined;
    bedrooms?: number | undefined;
    bathrooms?: number | undefined;
    floors?: number | undefined;
    yearBuilt?: number | undefined;
    furnishing?: "unfurnished" | "semi_furnished" | "fully_furnished" | undefined;
    amenities?: string[] | undefined;
    features?: {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    } | undefined;
    availableFrom?: string | undefined;
}, {
    type: PropertyType;
    description: string;
    title: string;
    purpose: PropertyPurpose;
    price: number;
    area: {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    };
    location: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    };
    priceUnit?: "total" | "per_sqft" | "per_month" | undefined;
    bedrooms?: number | undefined;
    bathrooms?: number | undefined;
    floors?: number | undefined;
    yearBuilt?: number | undefined;
    furnishing?: "unfurnished" | "semi_furnished" | "fully_furnished" | undefined;
    amenities?: string[] | undefined;
    features?: {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    } | undefined;
    availableFrom?: string | undefined;
}>;
export declare const updatePropertySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof PropertyType>>;
    purpose: z.ZodOptional<z.ZodNativeEnum<typeof PropertyPurpose>>;
    price: z.ZodOptional<z.ZodNumber>;
    priceUnit: z.ZodOptional<z.ZodOptional<z.ZodEnum<["total", "per_sqft", "per_month"]>>>;
    area: z.ZodOptional<z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodOptional<z.ZodEnum<["sqft", "sqm", "acres", "hectares"]>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    }, {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    }>>;
    bedrooms: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    bathrooms: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    floors: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    yearBuilt: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    furnishing: z.ZodOptional<z.ZodOptional<z.ZodEnum<["unfurnished", "semi_furnished", "fully_furnished"]>>>;
    amenities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    location: z.ZodOptional<z.ZodObject<{
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        address: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        locality: z.ZodString;
        landmark: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    }, {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    }>>;
    features: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        parking: z.ZodOptional<z.ZodBoolean>;
        garden: z.ZodOptional<z.ZodBoolean>;
        pool: z.ZodOptional<z.ZodBoolean>;
        gym: z.ZodOptional<z.ZodBoolean>;
        security: z.ZodOptional<z.ZodBoolean>;
        elevator: z.ZodOptional<z.ZodBoolean>;
        powerBackup: z.ZodOptional<z.ZodBoolean>;
        waterSupply: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    }, {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    }>>>;
    availableFrom: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: PropertyType | undefined;
    description?: string | undefined;
    title?: string | undefined;
    purpose?: PropertyPurpose | undefined;
    price?: number | undefined;
    priceUnit?: "total" | "per_sqft" | "per_month" | undefined;
    area?: {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    } | undefined;
    bedrooms?: number | undefined;
    bathrooms?: number | undefined;
    floors?: number | undefined;
    yearBuilt?: number | undefined;
    furnishing?: "unfurnished" | "semi_furnished" | "fully_furnished" | undefined;
    amenities?: string[] | undefined;
    location?: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    } | undefined;
    features?: {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    } | undefined;
    availableFrom?: string | undefined;
}, {
    type?: PropertyType | undefined;
    description?: string | undefined;
    title?: string | undefined;
    purpose?: PropertyPurpose | undefined;
    price?: number | undefined;
    priceUnit?: "total" | "per_sqft" | "per_month" | undefined;
    area?: {
        value: number;
        unit?: "sqft" | "sqm" | "acres" | "hectares" | undefined;
    } | undefined;
    bedrooms?: number | undefined;
    bathrooms?: number | undefined;
    floors?: number | undefined;
    yearBuilt?: number | undefined;
    furnishing?: "unfurnished" | "semi_furnished" | "fully_furnished" | undefined;
    amenities?: string[] | undefined;
    location?: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: [number, number];
        locality: string;
        landmark?: string | undefined;
    } | undefined;
    features?: {
        parking?: boolean | undefined;
        garden?: boolean | undefined;
        pool?: boolean | undefined;
        gym?: boolean | undefined;
        security?: boolean | undefined;
        elevator?: boolean | undefined;
        powerBackup?: boolean | undefined;
        waterSupply?: boolean | undefined;
    } | undefined;
    availableFrom?: string | undefined;
}>;
export declare const propertyQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof PropertyType>>;
    purpose: z.ZodOptional<z.ZodNativeEnum<typeof PropertyPurpose>>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodString>;
    maxPrice: z.ZodOptional<z.ZodString>;
    bedrooms: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    lat: z.ZodOptional<z.ZodString>;
    lng: z.ZodOptional<z.ZodString>;
    radius: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["price", "createdAt", "views"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    limit?: string | undefined;
    type?: PropertyType | undefined;
    city?: string | undefined;
    state?: string | undefined;
    purpose?: PropertyPurpose | undefined;
    bedrooms?: string | undefined;
    page?: string | undefined;
    sortBy?: "createdAt" | "price" | "views" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    minPrice?: string | undefined;
    maxPrice?: string | undefined;
    lat?: string | undefined;
    lng?: string | undefined;
    radius?: string | undefined;
}, {
    search?: string | undefined;
    limit?: string | undefined;
    type?: PropertyType | undefined;
    city?: string | undefined;
    state?: string | undefined;
    purpose?: PropertyPurpose | undefined;
    bedrooms?: string | undefined;
    page?: string | undefined;
    sortBy?: "createdAt" | "price" | "views" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    minPrice?: string | undefined;
    maxPrice?: string | undefined;
    lat?: string | undefined;
    lng?: string | undefined;
    radius?: string | undefined;
}>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
//# sourceMappingURL=property.validation.d.ts.map