"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const legal_model_1 = require("./legal.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createCaseSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(types_1.LegalCaseType),
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().min(10).max(5000),
    property: zod_1.z.string().optional(),
    advisor: zod_1.z.string().optional(),
    consultationDate: zod_1.z.string().datetime().optional(),
});
// Create legal case
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createCaseSchema), async (req, res, next) => {
    try {
        const legalCase = await legal_model_1.LegalCase.create({
            ...req.body,
            client: req.user.userId,
            timeline: [{ event: 'Case Created', description: 'Case submitted for review', date: new Date(), addedBy: req.user.userId }],
        });
        (0, response_1.sendSuccess)(res, legalCase, 'Legal case created', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my cases (client or advisor)
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ client: userId }, { advisor: userId }] };
        if (req.query.status)
            filter.status = req.query.status;
        const [cases, total] = await Promise.all([
            legal_model_1.LegalCase.find(filter)
                .populate('property', 'title location')
                .populate('client', 'firstName lastName')
                .populate('advisor', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            legal_model_1.LegalCase.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, cases, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single case
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const legalCase = await legal_model_1.LegalCase.findById(req.params.id)
            .populate('property')
            .populate('client', 'firstName lastName email phone')
            .populate('advisor', 'firstName lastName email phone')
            .populate('documents')
            .populate('timeline.addedBy', 'firstName lastName');
        if (!legalCase)
            throw new errors_1.NotFoundError('Legal Case');
        (0, response_1.sendSuccess)(res, legalCase);
    }
    catch (error) {
        next(error);
    }
});
// Assign advisor
router.patch('/:id/assign', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.LEGAL_ADVISOR), async (req, res, next) => {
    try {
        const legalCase = await legal_model_1.LegalCase.findById(req.params.id);
        if (!legalCase)
            throw new errors_1.NotFoundError('Legal Case');
        legalCase.advisor = req.body.advisorId;
        legalCase.status = types_1.GlobalStatus.IN_PROGRESS;
        legalCase.timeline.push({
            event: 'Advisor Assigned',
            description: `Advisor assigned to the case`,
            date: new Date(),
            addedBy: req.user.userId,
        });
        await legalCase.save();
        (0, response_1.sendSuccess)(res, legalCase, 'Advisor assigned');
    }
    catch (error) {
        next(error);
    }
});
// Add timeline event
router.post('/:id/timeline', auth_1.authenticate, async (req, res, next) => {
    try {
        const legalCase = await legal_model_1.LegalCase.findById(req.params.id);
        if (!legalCase)
            throw new errors_1.NotFoundError('Legal Case');
        legalCase.timeline.push({
            ...req.body,
            date: new Date(),
            addedBy: req.user.userId,
        });
        await legalCase.save();
        (0, response_1.sendSuccess)(res, legalCase, 'Timeline updated');
    }
    catch (error) {
        next(error);
    }
});
// Update case status
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const legalCase = await legal_model_1.LegalCase.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!legalCase)
            throw new errors_1.NotFoundError('Legal Case');
        (0, response_1.sendSuccess)(res, legalCase, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
// Admin: get all cases
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.type)
            filter.type = req.query.type;
        const [cases, total] = await Promise.all([
            legal_model_1.LegalCase.find(filter)
                .populate('client', 'firstName lastName')
                .populate('advisor', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            legal_model_1.LegalCase.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, cases, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=legal.routes.js.map