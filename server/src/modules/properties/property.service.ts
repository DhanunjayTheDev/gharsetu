import { Property, IProperty } from './property.model';
import { CreatePropertyInput, UpdatePropertyInput } from './property.validation';
import { PropertyStatus } from '../../shared/types';
import { NotFoundError, ForbiddenError } from '../../shared/utils/errors';
import { cacheGet, cacheSet, cacheDel } from '../../config/redis';

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

export const propertyService = {
  async create(ownerId: string, input: CreatePropertyInput) {
    const property = await Property.create({
      ...input,
      owner: ownerId,
      location: { type: 'Point', ...input.location },
    });
    await cacheDel('properties:*');
    return property;
  },

  async findAll(filters: PropertyFilters, page: number, limit: number) {
    const query: Record<string, any> = { status: PropertyStatus.ACTIVE };

    if (filters.type) query.type = filters.type;
    if (filters.purpose) query.purpose = filters.purpose;
    if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
    if (filters.state) query['location.state'] = new RegExp(filters.state, 'i');
    if (filters.bedrooms) query.bedrooms = parseInt(String(filters.bedrooms));
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Geo query
    if (filters.lat && filters.lng && filters.radius) {
      query['location.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.lng, filters.lat],
          },
          $maxDistance: filters.radius * 1000, // km to meters
        },
      };
    }

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'firstName lastName email phone avatar')
        .skip(skip)
        .limit(limit)
        .sort({ isFeatured: -1, createdAt: -1 }),
      Property.countDocuments(query),
    ]);

    return { properties, total };
  },

  async findById(id: string) {
    const cacheKey = `property:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return JSON.parse(cached);

    const property = await Property.findById(id)
      .populate('owner', 'firstName lastName email phone avatar')
      .populate('documents');
    if (!property) throw new NotFoundError('Property');

    // Increment views
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    await cacheSet(cacheKey, JSON.stringify(property), 600);
    return property;
  },

  async update(id: string, userId: string, userRole: string, input: UpdatePropertyInput) {
    const property = await Property.findById(id);
    if (!property) throw new NotFoundError('Property');

    if (property.owner.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You can only update your own properties');
    }

    Object.assign(property, input);
    if (input.location) {
      property.location = { type: 'Point', ...input.location } as any;
    }
    await property.save();
    await cacheDel(`property:${id}`);
    await cacheDel('properties:*');
    return property;
  },

  async delete(id: string, userId: string, userRole: string) {
    const property = await Property.findById(id);
    if (!property) throw new NotFoundError('Property');

    if (property.owner.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You can only delete your own properties');
    }

    property.status = PropertyStatus.INACTIVE;
    await property.save();
    await cacheDel(`property:${id}`);
    await cacheDel('properties:*');
    return property;
  },

  async getMyProperties(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find({ owner: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Property.countDocuments({ owner: userId }),
    ]);
    return { properties, total };
  },

  async updateStatus(id: string, status: PropertyStatus) {
    const property = await Property.findByIdAndUpdate(id, { status }, { new: true });
    if (!property) throw new NotFoundError('Property');
    await cacheDel(`property:${id}`);
    return property;
  },

  async getNearby(lat: number, lng: number, radiusKm = 10, limit = 10) {
    return Property.find({
      status: PropertyStatus.ACTIVE,
      'location.coordinates': {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
    })
      .limit(limit)
      .populate('owner', 'firstName lastName');
  },

  async getFeatured(limit = 10) {
    return Property.find({ status: PropertyStatus.ACTIVE, isFeatured: true })
      .limit(limit)
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 });
  },
};
