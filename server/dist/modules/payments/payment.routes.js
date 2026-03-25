"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const payment_model_1 = require("./payment.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
const createPaymentSchema = zod_1.z.object({
    payee: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().min(5),
    type: zod_1.z.enum(['service_fee', 'commission', 'rent', 'deposit', 'consultation_fee', 'booking_fee']),
    relatedEntity: zod_1.z.object({
        entityType: zod_1.z.string(),
        entityId: zod_1.z.string(),
    }).optional(),
    paymentMethod: zod_1.z.string().optional(),
});
// Initiate payment
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createPaymentSchema), async (req, res, next) => {
    try {
        const payment = await payment_model_1.Payment.create({
            ...req.body,
            payer: req.user.userId,
            transactionId: `TXN-${Date.now()}-${crypto_1.default.randomBytes(4).toString('hex')}`,
        });
        (0, response_1.sendSuccess)(res, payment, 'Payment initiated', 201);
    }
    catch (error) {
        next(error);
    }
});
// My payments
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ payer: userId }, { payee: userId }] };
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.type)
            filter.type = req.query.type;
        const [payments, total] = await Promise.all([
            payment_model_1.Payment.find(filter)
                .populate('payer', 'firstName lastName')
                .populate('payee', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            payment_model_1.Payment.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, payments, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single payment
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const payment = await payment_model_1.Payment.findById(req.params.id)
            .populate('payer', 'firstName lastName email')
            .populate('payee', 'firstName lastName email');
        if (!payment)
            throw new errors_1.NotFoundError('Payment');
        (0, response_1.sendSuccess)(res, payment);
    }
    catch (error) {
        next(error);
    }
});
// Complete payment (webhook simulation)
router.patch('/:id/complete', auth_1.authenticate, async (req, res, next) => {
    try {
        const payment = await payment_model_1.Payment.findByIdAndUpdate(req.params.id, {
            status: types_1.PaymentStatus.COMPLETED,
            paidAt: new Date(),
        }, { new: true });
        if (!payment)
            throw new errors_1.NotFoundError('Payment');
        (0, response_1.sendSuccess)(res, payment, 'Payment completed');
    }
    catch (error) {
        next(error);
    }
});
// Refund
router.patch('/:id/refund', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const payment = await payment_model_1.Payment.findByIdAndUpdate(req.params.id, {
            status: types_1.PaymentStatus.REFUNDED,
        }, { new: true });
        if (!payment)
            throw new errors_1.NotFoundError('Payment');
        (0, response_1.sendSuccess)(res, payment, 'Payment refunded');
    }
    catch (error) {
        next(error);
    }
});
// Admin: all payments
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.type)
            filter.type = req.query.type;
        const [payments, total] = await Promise.all([
            payment_model_1.Payment.find(filter)
                .populate('payer', 'firstName lastName')
                .populate('payee', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            payment_model_1.Payment.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, payments, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map