"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const jv_model_1 = require("./jv.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createJVSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().max(5000).optional(),
    builder: zod_1.z.string().min(1),
    property: zod_1.z.string().optional(),
    landDetails: zod_1.z.object({
        area: zod_1.z.number().positive(),
        areaUnit: zod_1.z.string().optional(),
        location: zod_1.z.string().min(1),
        surveyNumber: zod_1.z.string().optional(),
    }),
    terms: zod_1.z.object({
        landOwnerShare: zod_1.z.number().min(0).max(100),
        builderShare: zod_1.z.number().min(0).max(100),
        estimatedUnits: zod_1.z.number().optional(),
        estimatedCost: zod_1.z.number().optional(),
        timeline: zod_1.z.string().optional(),
    }),
});
// CREATE JV project
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.ADMIN), (0, validate_1.validate)(createJVSchema), async (req, res, next) => {
    try {
        const jv = await jv_model_1.JointVenture.create({ ...req.body, landowner: req.user.userId });
        (0, response_1.sendSuccess)(res, jv, 'Joint venture created', 201);
    }
    catch (error) {
        next(error);
    }
});
// My JV projects
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ landowner: userId }, { builder: userId }] };
        const [jvs, total] = await Promise.all([
            jv_model_1.JointVenture.find(filter)
                .populate('landowner', 'firstName lastName')
                .populate('builder', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            jv_model_1.JointVenture.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, jvs, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const jv = await jv_model_1.JointVenture.findById(req.params.id)
            .populate('landowner', 'firstName lastName email phone')
            .populate('builder', 'firstName lastName email phone')
            .populate('property').populate('documents');
        if (!jv)
            throw new errors_1.NotFoundError('Joint Venture');
        (0, response_1.sendSuccess)(res, jv);
    }
    catch (error) {
        next(error);
    }
});
// Update stage
router.patch('/:id/stage', auth_1.authenticate, async (req, res, next) => {
    try {
        const jv = await jv_model_1.JointVenture.findByIdAndUpdate(req.params.id, { stage: req.body.stage }, { new: true });
        if (!jv)
            throw new errors_1.NotFoundError('Joint Venture');
        (0, response_1.sendSuccess)(res, jv, 'Stage updated');
    }
    catch (error) {
        next(error);
    }
});
// Add milestone
router.post('/:id/milestones', auth_1.authenticate, async (req, res, next) => {
    try {
        const jv = await jv_model_1.JointVenture.findById(req.params.id);
        if (!jv)
            throw new errors_1.NotFoundError('Joint Venture');
        jv.milestones.push(req.body);
        await jv.save();
        (0, response_1.sendSuccess)(res, jv, 'Milestone added');
    }
    catch (error) {
        next(error);
    }
});
// Admin: get all
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {};
        if (req.query.stage)
            filter.stage = req.query.stage;
        const [jvs, total] = await Promise.all([
            jv_model_1.JointVenture.find(filter)
                .populate('landowner', 'firstName lastName')
                .populate('builder', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            jv_model_1.JointVenture.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, jvs, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=jv.routes.js.map