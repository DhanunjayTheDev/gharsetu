"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const inquiry_model_1 = require("./inquiry.model");
const property_model_1 = require("../properties/property.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createInquirySchema = zod_1.z.object({
    property: zod_1.z.string().min(1),
    message: zod_1.z.string().min(5).max(1000),
    type: zod_1.z.enum(['buy', 'rent', 'visit', 'general']),
});
// Create inquiry
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createInquirySchema), async (req, res, next) => {
    try {
        const property = await property_model_1.Property.findById(req.body.property);
        if (!property)
            throw new errors_1.NotFoundError('Property');
        if (property.owner.toString() === req.user.userId) {
            throw new errors_1.ValidationError('Cannot inquire on your own property');
        }
        const inquiry = await inquiry_model_1.Inquiry.create({
            ...req.body,
            from: req.user.userId,
            to: property.owner,
        });
        await property_model_1.Property.findByIdAndUpdate(req.body.property, { $inc: { inquiryCount: 1 } });
        (0, response_1.sendSuccess)(res, inquiry, 'Inquiry sent', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my sent inquiries
router.get('/sent', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const [inquiries, total] = await Promise.all([
            inquiry_model_1.Inquiry.find({ from: req.user.userId })
                .populate('property', 'title images location price')
                .populate('to', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            inquiry_model_1.Inquiry.countDocuments({ from: req.user.userId }),
        ]);
        (0, response_1.sendPaginated)(res, inquiries, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get received inquiries
router.get('/received', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = { to: req.user.userId };
        if (req.query.status)
            filter.status = req.query.status;
        const [inquiries, total] = await Promise.all([
            inquiry_model_1.Inquiry.find(filter)
                .populate('property', 'title images location price')
                .populate('from', 'firstName lastName email phone')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            inquiry_model_1.Inquiry.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, inquiries, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Respond to inquiry
router.patch('/:id/respond', auth_1.authenticate, async (req, res, next) => {
    try {
        const inquiry = await inquiry_model_1.Inquiry.findOne({ _id: req.params.id, to: req.user.userId });
        if (!inquiry)
            throw new errors_1.NotFoundError('Inquiry');
        inquiry.response = req.body.response;
        inquiry.status = types_1.GlobalStatus.IN_PROGRESS;
        inquiry.respondedAt = new Date();
        await inquiry.save();
        (0, response_1.sendSuccess)(res, inquiry, 'Response sent');
    }
    catch (error) {
        next(error);
    }
});
// Update inquiry status
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const inquiry = await inquiry_model_1.Inquiry.findOne({
            _id: req.params.id,
            $or: [{ from: req.user.userId }, { to: req.user.userId }],
        });
        if (!inquiry)
            throw new errors_1.NotFoundError('Inquiry');
        inquiry.status = req.body.status;
        await inquiry.save();
        (0, response_1.sendSuccess)(res, inquiry, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=inquiry.routes.js.map