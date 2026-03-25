import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus } from '../../shared/types';
import { Campaign } from './marketing.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createCampaignSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(5000).optional(),
  property: z.string().optional(),
  partner: z.string().min(1),
  type: z.enum(['project_listing', 'lead_generation', 'brand_promotion', 'digital_marketing']),
  budget: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Create campaign
router.post('/', authenticate, authorize(UserRole.BUILDER, UserRole.PROPERTY_OWNER, UserRole.ADMIN), validate(createCampaignSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await Campaign.create({ ...req.body, client: req.user!.userId });
      sendSuccess(res, campaign, 'Campaign created', 201);
    } catch (error) { next(error); }
  }
);

// My campaigns
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter = { $or: [{ client: userId }, { partner: userId }] };
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .populate('property', 'title images')
        .populate('partner', 'firstName lastName')
        .populate('client', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Campaign.countDocuments(filter),
    ]);
    sendPaginated(res, campaigns, total, page, limit);
  } catch (error) { next(error); }
});

// Get single campaign
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('property')
      .populate('partner', 'firstName lastName email phone')
      .populate('client', 'firstName lastName email phone');
    if (!campaign) throw new NotFoundError('Campaign');
    sendSuccess(res, campaign);
  } catch (error) { next(error); }
});

// Add lead
router.post('/:id/leads', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) throw new NotFoundError('Campaign');
      campaign.leads.push({ ...req.body, createdAt: new Date() });
      campaign.analytics.leads = campaign.leads.length;
      await campaign.save();
      sendSuccess(res, campaign, 'Lead added');
    } catch (error) { next(error); }
  }
);

// Update analytics
router.patch('/:id/analytics', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { $inc: req.body },
        { new: true }
      );
      if (!campaign) throw new NotFoundError('Campaign');
      sendSuccess(res, campaign, 'Analytics updated');
    } catch (error) { next(error); }
  }
);

// Update status
router.patch('/:id/status', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!campaign) throw new NotFoundError('Campaign');
      sendSuccess(res, campaign, 'Status updated');
    } catch (error) { next(error); }
  }
);

export default router;
