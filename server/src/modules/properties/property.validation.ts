import { z } from 'zod';
import { PropertyType, PropertyPurpose } from '../../shared/types';

export const createPropertySchema = z.object({
  title: z.string().min(5).max(200).trim(),
  description: z.string().min(20).max(5000),
  type: z.nativeEnum(PropertyType),
  purpose: z.nativeEnum(PropertyPurpose),
  price: z.number().positive(),
  priceUnit: z.enum(['total', 'per_sqft', 'per_month']).optional(),
  area: z.object({
    value: z.number().positive(),
    unit: z.enum(['sqft', 'sqm', 'acres', 'hectares']).optional(),
  }),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(0).optional(),
  yearBuilt: z.number().int().min(1900).max(2030).optional(),
  furnishing: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']).optional(),
  amenities: z.array(z.string()).optional(),
  location: z.object({
    coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    address: z.string().min(5),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(5).max(10),
    locality: z.string().min(1),
    landmark: z.string().optional(),
  }),
  features: z
    .object({
      parking: z.boolean().optional(),
      garden: z.boolean().optional(),
      pool: z.boolean().optional(),
      gym: z.boolean().optional(),
      security: z.boolean().optional(),
      elevator: z.boolean().optional(),
      powerBackup: z.boolean().optional(),
      waterSupply: z.boolean().optional(),
    })
    .optional(),
  availableFrom: z.string().datetime().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(PropertyType).optional(),
  purpose: z.nativeEnum(PropertyPurpose).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bedrooms: z.string().optional(),
  search: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radius: z.string().optional(), // in km
  sortBy: z.enum(['price', 'createdAt', 'views']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
