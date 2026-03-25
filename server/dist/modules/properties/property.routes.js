"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const upload_1 = require("../../shared/middleware/upload");
const types_1 = require("../../shared/types");
const property_service_1 = require("./property.service");
const property_validation_1 = require("./property.validation");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const cloudinary_1 = require("../../config/cloudinary");
const router = (0, express_1.Router)();
// Public routes
router.get('/', auth_1.optionalAuth, async (req, res, next) => {
    try {
        const { page, limit } = (0, pagination_1.parsePagination)(req);
        const filters = {
            type: req.query.type,
            purpose: req.query.purpose,
            city: req.query.city,
            state: req.query.state,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
            search: req.query.search,
            lat: req.query.lat ? Number(req.query.lat) : undefined,
            lng: req.query.lng ? Number(req.query.lng) : undefined,
            radius: req.query.radius ? Number(req.query.radius) : undefined,
        };
        const { properties, total } = await property_service_1.propertyService.findAll(filters, page, limit);
        (0, response_1.sendPaginated)(res, properties, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
router.get('/featured', async (_req, res, next) => {
    try {
        const properties = await property_service_1.propertyService.getFeatured();
        (0, response_1.sendSuccess)(res, properties);
    }
    catch (error) {
        next(error);
    }
});
router.get('/nearby', async (req, res, next) => {
    try {
        const { lat, lng, radius, limit } = req.query;
        const properties = await property_service_1.propertyService.getNearby(Number(lat), Number(lng), Number(radius) || 10, Number(limit) || 10);
        (0, response_1.sendSuccess)(res, properties);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const property = await property_service_1.propertyService.findById(req.params.id);
        (0, response_1.sendSuccess)(res, property);
    }
    catch (error) {
        next(error);
    }
});
// Protected routes
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.BUILDER, types_1.UserRole.ADMIN), (0, validate_1.validate)(property_validation_1.createPropertySchema), async (req, res, next) => {
    try {
        const property = await property_service_1.propertyService.create(req.user.userId, req.body);
        (0, response_1.sendSuccess)(res, property, 'Property created', 201);
    }
    catch (error) {
        next(error);
    }
});
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.BUILDER, types_1.UserRole.ADMIN), (0, validate_1.validate)(property_validation_1.updatePropertySchema), async (req, res, next) => {
    try {
        const property = await property_service_1.propertyService.update(req.params.id, req.user.userId, req.user.role, req.body);
        (0, response_1.sendSuccess)(res, property, 'Property updated');
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.BUILDER, types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        await property_service_1.propertyService.delete(req.params.id, req.user.userId, req.user.role);
        (0, response_1.sendSuccess)(res, null, 'Property deactivated');
    }
    catch (error) {
        next(error);
    }
});
router.get('/my/listings', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.BUILDER), async (req, res, next) => {
    try {
        const { page, limit } = (0, pagination_1.parsePagination)(req);
        const { properties, total } = await property_service_1.propertyService.getMyProperties(req.user.userId, page, limit);
        (0, response_1.sendPaginated)(res, properties, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Image upload
router.post('/:id/images', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.BUILDER, types_1.UserRole.ADMIN), upload_1.upload.array('images', 10), async (req, res, next) => {
    try {
        const files = req.files;
        const uploadedUrls = [];
        for (const file of files) {
            const result = await (0, cloudinary_1.uploadToCloudinary)(file.path, 'properties');
            uploadedUrls.push(result.url);
        }
        const property = await property_service_1.propertyService.update(req.params.id, req.user.userId, req.user.role, { images: uploadedUrls });
        (0, response_1.sendSuccess)(res, property, 'Images uploaded');
    }
    catch (error) {
        next(error);
    }
});
// Admin: update status
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const property = await property_service_1.propertyService.updateStatus(req.params.id, req.body.status);
        (0, response_1.sendSuccess)(res, property, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=property.routes.js.map