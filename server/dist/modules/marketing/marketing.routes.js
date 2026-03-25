"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const marketing_model_1 = require("./marketing.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createCampaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().max(5000).optional(),
    property: zod_1.z.string().optional(),
    partner: zod_1.z.string().min(1),
    type: zod_1.z.enum(['project_listing', 'lead_generation', 'brand_promotion', 'digital_marketing']),
    budget: zod_1.z.number().positive(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
});
// Create campaign
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.BUILDER, types_1.UserRole.PROPERTY_OWNER, types_1.UserRole.ADMIN), (0, validate_1.validate)(createCampaignSchema), async (req, res, next) => {
    try {
        const campaign = await marketing_model_1.Campaign.create({ ...req.body, client: req.user.userId });
        (0, response_1.sendSuccess)(res, campaign, 'Campaign created', 201);
    }
    catch (error) {
        next(error);
    }
});
// My campaigns
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ client: userId }, { partner: userId }] };
        const [campaigns, total] = await Promise.all([
            marketing_model_1.Campaign.find(filter)
                .populate('property', 'title images')
                .populate('partner', 'firstName lastName')
                .populate('client', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            marketing_model_1.Campaign.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, campaigns, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single campaign
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const campaign = await marketing_model_1.Campaign.findById(req.params.id)
            .populate('property')
            .populate('partner', 'firstName lastName email phone')
            .populate('client', 'firstName lastName email phone');
        if (!campaign)
            throw new errors_1.NotFoundError('Campaign');
        (0, response_1.sendSuccess)(res, campaign);
    }
    catch (error) {
        next(error);
    }
});
// Add lead
router.post('/:id/leads', auth_1.authenticate, async (req, res, next) => {
    try {
        const campaign = await marketing_model_1.Campaign.findById(req.params.id);
        if (!campaign)
            throw new errors_1.NotFoundError('Campaign');
        campaign.leads.push({ ...req.body, createdAt: new Date() });
        campaign.analytics.leads = campaign.leads.length;
        await campaign.save();
        (0, response_1.sendSuccess)(res, campaign, 'Lead added');
    }
    catch (error) {
        next(error);
    }
});
// Update analytics
router.patch('/:id/analytics', auth_1.authenticate, async (req, res, next) => {
    try {
        const campaign = await marketing_model_1.Campaign.findByIdAndUpdate(req.params.id, { $inc: req.body }, { new: true });
        if (!campaign)
            throw new errors_1.NotFoundError('Campaign');
        (0, response_1.sendSuccess)(res, campaign, 'Analytics updated');
    }
    catch (error) {
        next(error);
    }
});
// Update status
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const campaign = await marketing_model_1.Campaign.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!campaign)
            throw new errors_1.NotFoundError('Campaign');
        (0, response_1.sendSuccess)(res, campaign, 'Status updated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=marketing.routes.js.map