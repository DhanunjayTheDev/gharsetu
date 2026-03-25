"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const feedback_model_1 = require("./feedback.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createFeedbackSchema = zod_1.z.object({
    entityType: zod_1.z.enum(['Property', 'User', 'LegalCase', 'PackersBooking', 'Campaign']),
    entityId: zod_1.z.string().min(1),
    rating: zod_1.z.number().int().min(1).max(5),
    review: zod_1.z.string().min(5).max(1000),
});
// Create feedback
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createFeedbackSchema), async (req, res, next) => {
    try {
        const feedback = await feedback_model_1.Feedback.create({ ...req.body, from: req.user.userId });
        (0, response_1.sendSuccess)(res, feedback, 'Feedback submitted', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get feedback for an entity
router.get('/entity/:entityType/:entityId', async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {
            entityType: req.params.entityType,
            entityId: req.params.entityId,
            isVisible: true,
        };
        const [feedbacks, total, avgResult] = await Promise.all([
            feedback_model_1.Feedback.find(filter)
                .populate('from', 'firstName lastName avatar')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            feedback_model_1.Feedback.countDocuments(filter),
            feedback_model_1.Feedback.aggregate([
                { $match: { entityType: req.params.entityType, entityId: new mongoose_1.default.Types.ObjectId(req.params.entityId), isVisible: true } },
                { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);
        const averageRating = avgResult[0]?.averageRating || 0;
        (0, response_1.sendSuccess)(res, { feedbacks, averageRating: Math.round(averageRating * 10) / 10, total });
    }
    catch (error) {
        next(error);
    }
});
// Get my feedback
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const feedbacks = await feedback_model_1.Feedback.find({ from: req.user.userId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, feedbacks);
    }
    catch (error) {
        next(error);
    }
});
// Update feedback
router.patch('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const feedback = await feedback_model_1.Feedback.findOneAndUpdate({ _id: req.params.id, from: req.user.userId }, { rating: req.body.rating, review: req.body.review }, { new: true });
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback');
        (0, response_1.sendSuccess)(res, feedback, 'Feedback updated');
    }
    catch (error) {
        next(error);
    }
});
// Delete feedback
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const feedback = await feedback_model_1.Feedback.findOneAndDelete({ _id: req.params.id, from: req.user.userId });
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback');
        (0, response_1.sendSuccess)(res, null, 'Feedback deleted');
    }
    catch (error) {
        next(error);
    }
});
// Admin: toggle visibility
router.patch('/:id/visibility', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const feedback = await feedback_model_1.Feedback.findByIdAndUpdate(req.params.id, { isVisible: req.body.isVisible }, { new: true });
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback');
        (0, response_1.sendSuccess)(res, feedback, 'Visibility updated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map