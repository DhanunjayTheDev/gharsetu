import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, JVStage, GlobalStatus } from '../../shared/types';
import { JointVenture } from './jv.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createJVSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(5000).optional(),
  builder: z.string().min(1),
  property: z.string().optional(),
  landDetails: z.object({
    area: z.number().positive(),
    areaUnit: z.string().optional(),
    location: z.string().min(1),
    surveyNumber: z.string().optional(),
  }),
  terms: z.object({
    landOwnerShare: z.number().min(0).max(100),
    builderShare: z.number().min(0).max(100),
    estimatedUnits: z.number().optional(),
    estimatedCost: z.number().optional(),
    timeline: z.string().optional(),
  }),
});

// CREATE JV project
router.post('/', authenticate, authorize(UserRole.PROPERTY_OWNER, UserRole.ADMIN), validate(createJVSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const jv = await JointVenture.create({ ...req.body, landowner: req.user!.userId });
      sendSuccess(res, jv, 'Joint venture created', 201);
    } catch (error) { next(error); }
  }
);

// My JV projects
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter = { $or: [{ landowner: userId }, { builder: userId }] };
    const [jvs, total] = await Promise.all([
      JointVenture.find(filter)
        .populate('landowner', 'firstName lastName')
        .populate('builder', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      JointVenture.countDocuments(filter),
    ]);
    sendPaginated(res, jvs, total, page, limit);
  } catch (error) { next(error); }
});

// Get single
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jv = await JointVenture.findById(req.params.id)
      .populate('landowner', 'firstName lastName email phone')
      .populate('builder', 'firstName lastName email phone')
      .populate('property').populate('documents');
    if (!jv) throw new NotFoundError('Joint Venture');
    sendSuccess(res, jv);
  } catch (error) { next(error); }
});

// Update stage
router.patch('/:id/stage', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jv = await JointVenture.findByIdAndUpdate(req.params.id, { stage: req.body.stage }, { new: true });
    if (!jv) throw new NotFoundError('Joint Venture');
    sendSuccess(res, jv, 'Stage updated');
  } catch (error) { next(error); }
});

// Add milestone
router.post('/:id/milestones', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jv = await JointVenture.findById(req.params.id);
    if (!jv) throw new NotFoundError('Joint Venture');
    jv.milestones.push(req.body);
    await jv.save();
    sendSuccess(res, jv, 'Milestone added');
  } catch (error) { next(error); }
});

// Admin: get all
router.get('/', authenticate, authorize(UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req);
      const filter: Record<string, any> = {};
      if (req.query.stage) filter.stage = req.query.stage;
      const [jvs, total] = await Promise.all([
        JointVenture.find(filter)
          .populate('landowner', 'firstName lastName')
          .populate('builder', 'firstName lastName')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        JointVenture.countDocuments(filter),
      ]);
      sendPaginated(res, jvs, total, page, limit);
    } catch (error) { next(error); }
  }
);

export default router;
