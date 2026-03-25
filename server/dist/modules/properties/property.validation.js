"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyQuerySchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../../shared/types");
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200).trim(),
    description: zod_1.z.string().min(20).max(5000),
    type: zod_1.z.nativeEnum(types_1.PropertyType),
    purpose: zod_1.z.nativeEnum(types_1.PropertyPurpose),
    price: zod_1.z.number().positive(),
    priceUnit: zod_1.z.enum(['total', 'per_sqft', 'per_month']).optional(),
    area: zod_1.z.object({
        value: zod_1.z.number().positive(),
        unit: zod_1.z.enum(['sqft', 'sqm', 'acres', 'hectares']).optional(),
    }),
    bedrooms: zod_1.z.number().int().min(0).optional(),
    bathrooms: zod_1.z.number().int().min(0).optional(),
    floors: zod_1.z.number().int().min(0).optional(),
    yearBuilt: zod_1.z.number().int().min(1900).max(2030).optional(),
    furnishing: zod_1.z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    location: zod_1.z.object({
        coordinates: zod_1.z.tuple([zod_1.z.number().min(-180).max(180), zod_1.z.number().min(-90).max(90)]),
        address: zod_1.z.string().min(5),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1),
        pincode: zod_1.z.string().min(5).max(10),
        locality: zod_1.z.string().min(1),
        landmark: zod_1.z.string().optional(),
    }),
    features: zod_1.z
        .object({
        parking: zod_1.z.boolean().optional(),
        garden: zod_1.z.boolean().optional(),
        pool: zod_1.z.boolean().optional(),
        gym: zod_1.z.boolean().optional(),
        security: zod_1.z.boolean().optional(),
        elevator: zod_1.z.boolean().optional(),
        powerBackup: zod_1.z.boolean().optional(),
        waterSupply: zod_1.z.boolean().optional(),
    })
        .optional(),
    availableFrom: zod_1.z.string().datetime().optional(),
});
exports.updatePropertySchema = exports.createPropertySchema.partial();
exports.propertyQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(types_1.PropertyType).optional(),
    purpose: zod_1.z.nativeEnum(types_1.PropertyPurpose).optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().optional(),
    maxPrice: zod_1.z.string().optional(),
    bedrooms: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    lat: zod_1.z.string().optional(),
    lng: zod_1.z.string().optional(),
    radius: zod_1.z.string().optional(), // in km
    sortBy: zod_1.z.enum(['price', 'createdAt', 'views']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
//# sourceMappingURL=property.validation.js.map