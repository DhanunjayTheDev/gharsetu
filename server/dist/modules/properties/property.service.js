"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyService = void 0;
const property_model_1 = require("./property.model");
const types_1 = require("../../shared/types");
const errors_1 = require("../../shared/utils/errors");
const redis_1 = require("../../config/redis");
exports.propertyService = {
    async create(ownerId, input) {
        const property = await property_model_1.Property.create({
            ...input,
            owner: ownerId,
            location: { type: 'Point', ...input.location },
        });
        await (0, redis_1.cacheDel)('properties:*');
        return property;
    },
    async findAll(filters, page, limit) {
        const query = { status: types_1.PropertyStatus.ACTIVE };
        if (filters.type)
            query.type = filters.type;
        if (filters.purpose)
            query.purpose = filters.purpose;
        if (filters.city)
            query['location.city'] = new RegExp(filters.city, 'i');
        if (filters.state)
            query['location.state'] = new RegExp(filters.state, 'i');
        if (filters.bedrooms)
            query.bedrooms = parseInt(String(filters.bedrooms));
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice)
                query.price.$gte = filters.minPrice;
            if (filters.maxPrice)
                query.price.$lte = filters.maxPrice;
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
            property_model_1.Property.find(query)
                .populate('owner', 'firstName lastName email phone avatar')
                .skip(skip)
                .limit(limit)
                .sort({ isFeatured: -1, createdAt: -1 }),
            property_model_1.Property.countDocuments(query),
        ]);
        return { properties, total };
    },
    async findById(id) {
        const cacheKey = `property:${id}`;
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const property = await property_model_1.Property.findById(id)
            .populate('owner', 'firstName lastName email phone avatar')
            .populate('documents');
        if (!property)
            throw new errors_1.NotFoundError('Property');
        // Increment views
        await property_model_1.Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
        await (0, redis_1.cacheSet)(cacheKey, JSON.stringify(property), 600);
        return property;
    },
    async update(id, userId, userRole, input) {
        const property = await property_model_1.Property.findById(id);
        if (!property)
            throw new errors_1.NotFoundError('Property');
        if (property.owner.toString() !== userId && userRole !== 'admin') {
            throw new errors_1.ForbiddenError('You can only update your own properties');
        }
        Object.assign(property, input);
        if (input.location) {
            property.location = { type: 'Point', ...input.location };
        }
        await property.save();
        await (0, redis_1.cacheDel)(`property:${id}`);
        await (0, redis_1.cacheDel)('properties:*');
        return property;
    },
    async delete(id, userId, userRole) {
        const property = await property_model_1.Property.findById(id);
        if (!property)
            throw new errors_1.NotFoundError('Property');
        if (property.owner.toString() !== userId && userRole !== 'admin') {
            throw new errors_1.ForbiddenError('You can only delete your own properties');
        }
        property.status = types_1.PropertyStatus.INACTIVE;
        await property.save();
        await (0, redis_1.cacheDel)(`property:${id}`);
        await (0, redis_1.cacheDel)('properties:*');
        return property;
    },
    async getMyProperties(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [properties, total] = await Promise.all([
            property_model_1.Property.find({ owner: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            property_model_1.Property.countDocuments({ owner: userId }),
        ]);
        return { properties, total };
    },
    async updateStatus(id, status) {
        const property = await property_model_1.Property.findByIdAndUpdate(id, { status }, { new: true });
        if (!property)
            throw new errors_1.NotFoundError('Property');
        await (0, redis_1.cacheDel)(`property:${id}`);
        return property;
    },
    async getNearby(lat, lng, radiusKm = 10, limit = 10) {
        return property_model_1.Property.find({
            status: types_1.PropertyStatus.ACTIVE,
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
        return property_model_1.Property.find({ status: types_1.PropertyStatus.ACTIVE, isFeatured: true })
            .limit(limit)
            .populate('owner', 'firstName lastName')
            .sort({ createdAt: -1 });
    },
};
//# sourceMappingURL=property.service.js.map