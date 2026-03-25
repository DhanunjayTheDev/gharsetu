"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../shared/middleware/auth");
const types_1 = require("../../shared/types");
const auth_model_1 = require("../auth/auth.model");
const property_model_1 = require("../properties/property.model");
const legal_model_1 = require("../legal/legal.model");
const payment_model_1 = require("../payments/payment.model");
const packers_model_1 = require("../packersMovers/packers.model");
const schedule_model_1 = require("../scheduling/schedule.model");
const feedback_model_1 = require("../feedback/feedback.model");
const inquiry_model_1 = require("../inquiries/inquiry.model");
const rental_model_1 = require("../rental/rental.model");
const marketing_model_1 = require("../marketing/marketing.model");
const response_1 = require("../../shared/utils/response");
const redis_1 = require("../../config/redis");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN));
// Dashboard analytics
router.get('/dashboard', async (_req, res, next) => {
    try {
        const cacheKey = 'admin:dashboard';
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached) {
            (0, response_1.sendSuccess)(res, JSON.parse(cached));
            return;
        }
        const [totalUsers, activeUsers, totalProperties, activeProperties, totalInquiries, totalPayments, totalRevenue, totalLegalCases, totalBookings, totalSchedules, totalFeedbacks, avgRating, totalRentals, totalCampaigns, usersByRole, recentUsers,] = await Promise.all([
            auth_model_1.User.countDocuments(),
            auth_model_1.User.countDocuments({ isActive: true }),
            property_model_1.Property.countDocuments(),
            property_model_1.Property.countDocuments({ status: 'active' }),
            inquiry_model_1.Inquiry.countDocuments(),
            payment_model_1.Payment.countDocuments({ status: 'completed' }),
            payment_model_1.Payment.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            legal_model_1.LegalCase.countDocuments(),
            packers_model_1.PackersBooking.countDocuments(),
            schedule_model_1.Schedule.countDocuments(),
            feedback_model_1.Feedback.countDocuments(),
            feedback_model_1.Feedback.aggregate([
                { $group: { _id: null, avg: { $avg: '$rating' } } },
            ]),
            rental_model_1.RentalAgreement.countDocuments(),
            marketing_model_1.Campaign.countDocuments(),
            auth_model_1.User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
            auth_model_1.User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
        ]);
        const data = {
            users: { total: totalUsers, active: activeUsers, byRole: usersByRole, recent: recentUsers },
            properties: { total: totalProperties, active: activeProperties },
            inquiries: { total: totalInquiries },
            payments: { total: totalPayments, revenue: totalRevenue[0]?.total || 0 },
            legalCases: { total: totalLegalCases },
            bookings: { total: totalBookings },
            schedules: { total: totalSchedules },
            feedback: { total: totalFeedbacks, averageRating: Math.round((avgRating[0]?.avg || 0) * 10) / 10 },
            rentals: { total: totalRentals },
            campaigns: { total: totalCampaigns },
        };
        await (0, redis_1.cacheSet)(cacheKey, JSON.stringify(data), 300);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (error) {
        next(error);
    }
});
// Approval workflows
router.get('/pending-approvals', async (_req, res, next) => {
    try {
        const [pendingProperties, pendingKYC, pendingLegal] = await Promise.all([
            property_model_1.Property.find({ status: 'under_review' }).populate('owner', 'firstName lastName').limit(20),
            auth_model_1.User.find({ 'kyc.status': 'submitted' }).select('firstName lastName email kyc').limit(20),
            legal_model_1.LegalCase.find({ status: 'pending' }).populate('client', 'firstName lastName').limit(20),
        ]);
        (0, response_1.sendSuccess)(res, { pendingProperties, pendingKYC, pendingLegal });
    }
    catch (error) {
        next(error);
    }
});
// Reports
router.get('/reports/payments', async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const filter = { status: 'completed' };
        if (from)
            filter.paidAt = { $gte: new Date(from) };
        if (to)
            filter.paidAt = { ...filter.paidAt, $lte: new Date(to) };
        const report = await payment_model_1.Payment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { type: '$type', month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
        ]);
        (0, response_1.sendSuccess)(res, report);
    }
    catch (error) {
        next(error);
    }
});
router.get('/reports/properties', async (_req, res, next) => {
    try {
        const report = await property_model_1.Property.aggregate([
            {
                $group: {
                    _id: { type: '$type', purpose: '$purpose', status: '$status' },
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                },
            },
        ]);
        (0, response_1.sendSuccess)(res, report);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map