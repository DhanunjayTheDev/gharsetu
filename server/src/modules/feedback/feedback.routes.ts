import { Router, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole } from '../../shared/types';
import { Feedback } from './feedback.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createFeedbackSchema = z.object({
  entityType: z.enum(['Property', 'User', 'LegalCase', 'PackersBooking', 'Campaign']),
  entityId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(5).max(1000),
});

// Create feedback
router.post('/', authenticate, validate(createFeedbackSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const feedback = await Feedback.create({ ...req.body, from: req.user!.userId });
      sendSuccess(res, feedback, 'Feedback submitted', 201);
    } catch (error) { next(error); }
  }
);

// Get feedback for an entity
router.get('/entity/:entityType/:entityId', async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter = {
      entityType: req.params.entityType,
      entityId: req.params.entityId,
      isVisible: true,
    };

    const [feedbacks, total, avgResult] = await Promise.all([
      Feedback.find(filter)
        .populate('from', 'firstName lastName avatar')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Feedback.countDocuments(filter),
      Feedback.aggregate([
        { $match: { entityType: req.params.entityType, entityId: new (mongoose as any).Types.ObjectId(req.params.entityId), isVisible: true } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);

    const averageRating = avgResult[0]?.averageRating || 0;
    sendSuccess(res, { feedbacks, averageRating: Math.round(averageRating * 10) / 10, total });
  } catch (error) { next(error); }
});

// Get my feedback
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await Feedback.find({ from: req.user!.userId }).sort({ createdAt: -1 });
    sendSuccess(res, feedbacks);
  } catch (error) { next(error); }
});

// Update feedback
router.patch('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const feedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id, from: req.user!.userId },
      { rating: req.body.rating, review: req.body.review },
      { new: true }
    );
    if (!feedback) throw new NotFoundError('Feedback');
    sendSuccess(res, feedback, 'Feedback updated');
  } catch (error) { next(error); }
});

// Delete feedback
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const feedback = await Feedback.findOneAndDelete({ _id: req.params.id, from: req.user!.userId });
    if (!feedback) throw new NotFoundError('Feedback');
    sendSuccess(res, null, 'Feedback deleted');
  } catch (error) { next(error); }
});

// Admin: toggle visibility
router.patch('/:id/visibility', authenticate, authorize(UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        { isVisible: req.body.isVisible },
        { new: true }
      );
      if (!feedback) throw new NotFoundError('Feedback');
      sendSuccess(res, feedback, 'Visibility updated');
    } catch (error) { next(error); }
  }
);

export default router;
