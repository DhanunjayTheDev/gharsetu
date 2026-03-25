"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const propertyManagement_model_1 = require("./propertyManagement.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createPMSchema = zod_1.z.object({
    property: zod_1.z.string().min(1),
    manager: zod_1.z.string().min(1),
    monthlyFee: zod_1.z.number().positive(),
    services: zod_1.z.array(zod_1.z.enum(['rent_collection', 'maintenance', 'tenant_screening', 'inspections'])),
    contractStart: zod_1.z.string().datetime(),
    contractEnd: zod_1.z.string().datetime(),
});
// Create management contract
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.ADMIN), (0, validate_1.validate)(createPMSchema), async (req, res, next) => {
    try {
        const contract = await propertyManagement_model_1.PropertyManagement.create({ ...req.body, owner: req.user.userId });
        (0, response_1.sendSuccess)(res, contract, 'Management contract created', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my contracts
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ owner: userId }, { manager: userId }] };
        const [contracts, total] = await Promise.all([
            propertyManagement_model_1.PropertyManagement.find(filter)
                .populate('property', 'title images location')
                .populate('owner', 'firstName lastName')
                .populate('manager', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            propertyManagement_model_1.PropertyManagement.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, contracts, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single contract
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const contract = await propertyManagement_model_1.PropertyManagement.findById(req.params.id)
            .populate('property').populate('owner', 'firstName lastName email phone')
            .populate('manager', 'firstName lastName email phone');
        if (!contract)
            throw new errors_1.NotFoundError('Contract');
        (0, response_1.sendSuccess)(res, contract);
    }
    catch (error) {
        next(error);
    }
});
// Add maintenance request
router.post('/:id/maintenance', auth_1.authenticate, async (req, res, next) => {
    try {
        const contract = await propertyManagement_model_1.PropertyManagement.findById(req.params.id);
        if (!contract)
            throw new errors_1.NotFoundError('Contract');
        contract.maintenanceRequests.push({ ...req.body, createdAt: new Date() });
        await contract.save();
        (0, response_1.sendSuccess)(res, contract, 'Maintenance request added');
    }
    catch (error) {
        next(error);
    }
});
// Update maintenance status
router.patch('/:id/maintenance/:maintenanceId', auth_1.authenticate, async (req, res, next) => {
    try {
        const contract = await propertyManagement_model_1.PropertyManagement.findById(req.params.id);
        if (!contract)
            throw new errors_1.NotFoundError('Contract');
        const maintenance = contract.maintenanceRequests.find((m) => m._id?.toString() === req.params.maintenanceId);
        if (!maintenance)
            throw new errors_1.NotFoundError('Maintenance request');
        Object.assign(maintenance, req.body);
        if (req.body.status === types_1.GlobalStatus.COMPLETED)
            maintenance.resolvedAt = new Date();
        await contract.save();
        (0, response_1.sendSuccess)(res, contract, 'Maintenance updated');
    }
    catch (error) {
        next(error);
    }
});
// Record rent collection
router.post('/:id/rent', auth_1.authenticate, async (req, res, next) => {
    try {
        const contract = await propertyManagement_model_1.PropertyManagement.findById(req.params.id);
        if (!contract)
            throw new errors_1.NotFoundError('Contract');
        contract.rentTracking.push({ ...req.body, collected: true, collectedAt: new Date() });
        await contract.save();
        (0, response_1.sendSuccess)(res, contract, 'Rent recorded');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=propertyManagement.routes.js.map