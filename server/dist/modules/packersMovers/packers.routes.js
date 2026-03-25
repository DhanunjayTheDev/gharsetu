"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const packers_model_1 = require("./packers.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const addressSchema = zod_1.z.object({
    address: zod_1.z.string().min(5),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    pincode: zod_1.z.string().min(5).max(10),
});
const createBookingSchema = zod_1.z.object({
    pickupAddress: addressSchema,
    dropAddress: addressSchema,
    scheduledDate: zod_1.z.string().datetime(),
    scheduledTime: zod_1.z.string().min(1),
    items: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        quantity: zod_1.z.number().int().positive(),
        category: zod_1.z.string().optional(),
    })).min(1),
    vehicleType: zod_1.z.enum(['mini', 'small', 'medium', 'large']).optional(),
    specialInstructions: zod_1.z.string().max(500).optional(),
});
// Cost estimation helper
const estimateCost = (items, vehicleType) => {
    const baseRate = { mini: 2000, small: 4000, medium: 7000, large: 12000 };
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    return baseRate[vehicleType] + (totalItems * 200);
};
// Create booking
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createBookingSchema), async (req, res, next) => {
    try {
        const estimatedCost = estimateCost(req.body.items, req.body.vehicleType || 'medium');
        const booking = await packers_model_1.PackersBooking.create({
            ...req.body,
            customer: req.user.userId,
            estimatedCost,
        });
        (0, response_1.sendSuccess)(res, booking, 'Booking created', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get cost estimate (no auth required)
router.post('/estimate', async (req, res, next) => {
    try {
        const { items, vehicleType } = req.body;
        const cost = estimateCost(items || [], vehicleType || 'medium');
        (0, response_1.sendSuccess)(res, { estimatedCost: cost });
    }
    catch (error) {
        next(error);
    }
});
// My bookings (customer)
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const [bookings, total] = await Promise.all([
            packers_model_1.PackersBooking.find({ customer: req.user.userId })
                .populate('provider', 'firstName lastName phone')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            packers_model_1.PackersBooking.countDocuments({ customer: req.user.userId }),
        ]);
        (0, response_1.sendPaginated)(res, bookings, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Provider: available bookings
router.get('/available', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PACKERS_MOVERS), async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = { status: types_1.GlobalStatus.PENDING, provider: { $exists: false } };
        const [bookings, total] = await Promise.all([
            packers_model_1.PackersBooking.find(filter)
                .populate('customer', 'firstName lastName phone')
                .skip(skip).limit(limit).sort({ scheduledDate: 1 }),
            packers_model_1.PackersBooking.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, bookings, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Provider: accept booking
router.patch('/:id/accept', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PACKERS_MOVERS), async (req, res, next) => {
    try {
        const booking = await packers_model_1.PackersBooking.findOneAndUpdate({ _id: req.params.id, status: types_1.GlobalStatus.PENDING, provider: { $exists: false } }, { provider: req.user.userId, status: types_1.GlobalStatus.IN_PROGRESS }, { new: true });
        if (!booking)
            throw new errors_1.NotFoundError('Booking');
        (0, response_1.sendSuccess)(res, booking, 'Booking accepted');
    }
    catch (error) {
        next(error);
    }
});
// Update status
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const update = { status: req.body.status };
        if (req.body.status === types_1.GlobalStatus.COMPLETED)
            update.completedAt = new Date();
        if (req.body.finalCost)
            update.finalCost = req.body.finalCost;
        const booking = await packers_model_1.PackersBooking.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!booking)
            throw new errors_1.NotFoundError('Booking');
        (0, response_1.sendSuccess)(res, booking, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
// Get single booking
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const booking = await packers_model_1.PackersBooking.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone')
            .populate('provider', 'firstName lastName email phone');
        if (!booking)
            throw new errors_1.NotFoundError('Booking');
        (0, response_1.sendSuccess)(res, booking);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=packers.routes.js.map