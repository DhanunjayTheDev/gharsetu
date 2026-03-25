import { Router, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { UserRole } from '../../shared/types';
import { User } from '../auth/auth.model';
import { Property } from '../properties/property.model';
import { LegalCase } from '../legal/legal.model';
import { Payment } from '../payments/payment.model';
import { PackersBooking } from '../packersMovers/packers.model';
import { Schedule } from '../scheduling/schedule.model';
import { Feedback } from '../feedback/feedback.model';
import { Inquiry } from '../inquiries/inquiry.model';
import { RentalAgreement } from '../rental/rental.model';
import { Campaign } from '../marketing/marketing.model';
import { sendSuccess } from '../../shared/utils/response';
import { cacheGet, cacheSet } from '../../config/redis';

const router = Router();
router.use(authenticate, authorize(UserRole.ADMIN));

// Dashboard analytics
router.get('/dashboard', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'admin:dashboard';
    const cached = await cacheGet(cacheKey);
    if (cached) {
      sendSuccess(res, JSON.parse(cached));
      return;
    }

    const [
      totalUsers,
      activeUsers,
      totalProperties,
      activeProperties,
      totalInquiries,
      totalPayments,
      totalRevenue,
      totalLegalCases,
      totalBookings,
      totalSchedules,
      totalFeedbacks,
      avgRating,
      totalRentals,
      totalCampaigns,
      usersByRole,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Inquiry.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      LegalCase.countDocuments(),
      PackersBooking.countDocuments(),
      Schedule.countDocuments(),
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
      RentalAgreement.countDocuments(),
      Campaign.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
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

    await cacheSet(cacheKey, JSON.stringify(data), 300);
    sendSuccess(res, data);
  } catch (error) { next(error); }
});

// Approval workflows
router.get('/pending-approvals', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [pendingProperties, pendingKYC, pendingLegal] = await Promise.all([
      Property.find({ status: 'under_review' }).populate('owner', 'firstName lastName').limit(20),
      User.find({ 'kyc.status': 'submitted' }).select('firstName lastName email kyc').limit(20),
      LegalCase.find({ status: 'pending' }).populate('client', 'firstName lastName').limit(20),
    ]);

    sendSuccess(res, { pendingProperties, pendingKYC, pendingLegal });
  } catch (error) { next(error); }
});

// Reports
router.get('/reports/payments', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query;
    const filter: Record<string, any> = { status: 'completed' };
    if (from) filter.paidAt = { $gte: new Date(from as string) };
    if (to) filter.paidAt = { ...filter.paidAt, $lte: new Date(to as string) };

    const report = await Payment.aggregate([
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

    sendSuccess(res, report);
  } catch (error) { next(error); }
});

router.get('/reports/properties', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const report = await Property.aggregate([
      {
        $group: {
          _id: { type: '$type', purpose: '$purpose', status: '$status' },
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);
    sendSuccess(res, report);
  } catch (error) { next(error); }
});

export default router;
