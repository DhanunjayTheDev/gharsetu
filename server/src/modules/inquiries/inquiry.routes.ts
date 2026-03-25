import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus } from '../../shared/types';
import { Inquiry } from './inquiry.model';
import { Property } from '../properties/property.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError, ValidationError } from '../../shared/utils/errors';

const router = Router();

const createInquirySchema = z.object({
  property: z.string().min(1),
  message: z.string().min(5).max(1000),
  type: z.enum(['buy', 'rent', 'visit', 'general']),
});

// Create inquiry
router.post(
  '/',
  authenticate,
  validate(createInquirySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const property = await Property.findById(req.body.property);
      if (!property) throw new NotFoundError('Property');
      if (property.owner.toString() === req.user!.userId) {
        throw new ValidationError('Cannot inquire on your own property');
      }

      const inquiry = await Inquiry.create({
        ...req.body,
        from: req.user!.userId,
        to: property.owner,
      });

      await Property.findByIdAndUpdate(req.body.property, { $inc: { inquiryCount: 1 } });
      sendSuccess(res, inquiry, 'Inquiry sent', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get my sent inquiries
router.get('/sent', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const [inquiries, total] = await Promise.all([
      Inquiry.find({ from: req.user!.userId })
        .populate('property', 'title images location price')
        .populate('to', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Inquiry.countDocuments({ from: req.user!.userId }),
    ]);
    sendPaginated(res, inquiries, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Get received inquiries
router.get('/received', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter: Record<string, any> = { to: req.user!.userId };
    if (req.query.status) filter.status = req.query.status;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('property', 'title images location price')
        .populate('from', 'firstName lastName email phone')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Inquiry.countDocuments(filter),
    ]);
    sendPaginated(res, inquiries, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Respond to inquiry
router.patch('/:id/respond', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, to: req.user!.userId });
    if (!inquiry) throw new NotFoundError('Inquiry');

    inquiry.response = req.body.response;
    inquiry.status = GlobalStatus.IN_PROGRESS;
    inquiry.respondedAt = new Date();
    await inquiry.save();

    sendSuccess(res, inquiry, 'Response sent');
  } catch (error) {
    next(error);
  }
});

// Update inquiry status
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inquiry = await Inquiry.findOne({
      _id: req.params.id,
      $or: [{ from: req.user!.userId }, { to: req.user!.userId }],
    });
    if (!inquiry) throw new NotFoundError('Inquiry');

    inquiry.status = req.body.status;
    await inquiry.save();
    sendSuccess(res, inquiry, 'Status updated');
  } catch (error) {
    next(error);
  }
});

export default router;
