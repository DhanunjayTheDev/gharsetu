"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const rental_model_1 = require("./rental.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createRentalSchema = zod_1.z.object({
    property: zod_1.z.string().min(1),
    tenant: zod_1.z.string().min(1),
    monthlyRent: zod_1.z.number().positive(),
    securityDeposit: zod_1.z.number().nonnegative(),
    leaseStart: zod_1.z.string().datetime(),
    leaseEnd: zod_1.z.string().datetime(),
    terms: zod_1.z.string().max(5000).optional(),
});
// Create rental agreement
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.ADMIN), (0, validate_1.validate)(createRentalSchema), async (req, res, next) => {
    try {
        const agreement = await rental_model_1.RentalAgreement.create({
            ...req.body,
            landlord: req.user.userId,
        });
        (0, response_1.sendSuccess)(res, agreement, 'Rental agreement created', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my rental agreements (as landlord or tenant)
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ landlord: userId }, { tenant: userId }] };
        const [agreements, total] = await Promise.all([
            rental_model_1.RentalAgreement.find(filter)
                .populate('property', 'title images location')
                .populate('landlord', 'firstName lastName')
                .populate('tenant', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            rental_model_1.RentalAgreement.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, agreements, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single agreement
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const agreement = await rental_model_1.RentalAgreement.findById(req.params.id)
            .populate('property')
            .populate('landlord', 'firstName lastName email phone')
            .populate('tenant', 'firstName lastName email phone')
            .populate('documents');
        if (!agreement)
            throw new errors_1.NotFoundError('Rental Agreement');
        (0, response_1.sendSuccess)(res, agreement);
    }
    catch (error) {
        next(error);
    }
});
// Update agreement status
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const agreement = await rental_model_1.RentalAgreement.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!agreement)
            throw new errors_1.NotFoundError('Rental Agreement');
        (0, response_1.sendSuccess)(res, agreement, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
// Renew agreement
router.post('/:id/renew', auth_1.authenticate, async (req, res, next) => {
    try {
        const agreement = await rental_model_1.RentalAgreement.findById(req.params.id);
        if (!agreement)
            throw new errors_1.NotFoundError('Rental Agreement');
        agreement.renewalHistory.push({
            renewedOn: new Date(),
            newEnd: new Date(req.body.newEnd),
            newRent: req.body.newRent || agreement.monthlyRent,
        });
        agreement.leaseEnd = new Date(req.body.newEnd);
        if (req.body.newRent)
            agreement.monthlyRent = req.body.newRent;
        agreement.status = types_1.GlobalStatus.IN_PROGRESS;
        await agreement.save();
        (0, response_1.sendSuccess)(res, agreement, 'Agreement renewed');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=rental.routes.js.map