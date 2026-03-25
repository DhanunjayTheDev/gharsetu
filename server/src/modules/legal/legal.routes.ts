import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus, LegalCaseType } from '../../shared/types';
import { LegalCase } from './legal.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createCaseSchema = z.object({
  type: z.nativeEnum(LegalCaseType),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  property: z.string().optional(),
  advisor: z.string().optional(),
  consultationDate: z.string().datetime().optional(),
});

// Create legal case
router.post('/', authenticate, validate(createCaseSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const legalCase = await LegalCase.create({
        ...req.body,
        client: req.user!.userId,
        timeline: [{ event: 'Case Created', description: 'Case submitted for review', date: new Date(), addedBy: req.user!.userId }],
      });
      sendSuccess(res, legalCase, 'Legal case created', 201);
    } catch (error) { next(error); }
  }
);

// Get my cases (client or advisor)
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter = { $or: [{ client: userId }, { advisor: userId }] };
    if (req.query.status) (filter as any).status = req.query.status;

    const [cases, total] = await Promise.all([
      LegalCase.find(filter)
        .populate('property', 'title location')
        .populate('client', 'firstName lastName')
        .populate('advisor', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      LegalCase.countDocuments(filter),
    ]);
    sendPaginated(res, cases, total, page, limit);
  } catch (error) { next(error); }
});

// Get single case
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const legalCase = await LegalCase.findById(req.params.id)
      .populate('property')
      .populate('client', 'firstName lastName email phone')
      .populate('advisor', 'firstName lastName email phone')
      .populate('documents')
      .populate('timeline.addedBy', 'firstName lastName');
    if (!legalCase) throw new NotFoundError('Legal Case');
    sendSuccess(res, legalCase);
  } catch (error) { next(error); }
});

// Assign advisor
router.patch('/:id/assign', authenticate, authorize(UserRole.ADMIN, UserRole.LEGAL_ADVISOR),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const legalCase = await LegalCase.findById(req.params.id);
      if (!legalCase) throw new NotFoundError('Legal Case');
      legalCase.advisor = req.body.advisorId;
      legalCase.status = GlobalStatus.IN_PROGRESS;
      legalCase.timeline.push({
        event: 'Advisor Assigned',
        description: `Advisor assigned to the case`,
        date: new Date(),
        addedBy: req.user!.userId as any,
      });
      await legalCase.save();
      sendSuccess(res, legalCase, 'Advisor assigned');
    } catch (error) { next(error); }
  }
);

// Add timeline event
router.post('/:id/timeline', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const legalCase = await LegalCase.findById(req.params.id);
      if (!legalCase) throw new NotFoundError('Legal Case');
      legalCase.timeline.push({
        ...req.body,
        date: new Date(),
        addedBy: req.user!.userId as any,
      });
      await legalCase.save();
      sendSuccess(res, legalCase, 'Timeline updated');
    } catch (error) { next(error); }
  }
);

// Update case status
router.patch('/:id/status', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const legalCase = await LegalCase.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!legalCase) throw new NotFoundError('Legal Case');
      sendSuccess(res, legalCase, 'Status updated');
    } catch (error) { next(error); }
  }
);

// Admin: get all cases
router.get('/', authenticate, authorize(UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req);
      const filter: Record<string, any> = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.type) filter.type = req.query.type;

      const [cases, total] = await Promise.all([
        LegalCase.find(filter)
          .populate('client', 'firstName lastName')
          .populate('advisor', 'firstName lastName')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        LegalCase.countDocuments(filter),
      ]);
      sendPaginated(res, cases, total, page, limit);
    } catch (error) { next(error); }
  }
);

export default router;
