import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus } from '../../shared/types';
import { RentalAgreement } from './rental.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createRentalSchema = z.object({
  property: z.string().min(1),
  tenant: z.string().min(1),
  monthlyRent: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  leaseStart: z.string().datetime(),
  leaseEnd: z.string().datetime(),
  terms: z.string().max(5000).optional(),
});

// Create rental agreement
router.post(
  '/',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.ADMIN),
  validate(createRentalSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const agreement = await RentalAgreement.create({
        ...req.body,
        landlord: req.user!.userId,
      });
      sendSuccess(res, agreement, 'Rental agreement created', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get my rental agreements (as landlord or tenant)
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter = { $or: [{ landlord: userId }, { tenant: userId }] };

    const [agreements, total] = await Promise.all([
      RentalAgreement.find(filter)
        .populate('property', 'title images location')
        .populate('landlord', 'firstName lastName')
        .populate('tenant', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      RentalAgreement.countDocuments(filter),
    ]);
    sendPaginated(res, agreements, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Get single agreement
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const agreement = await RentalAgreement.findById(req.params.id)
      .populate('property')
      .populate('landlord', 'firstName lastName email phone')
      .populate('tenant', 'firstName lastName email phone')
      .populate('documents');
    if (!agreement) throw new NotFoundError('Rental Agreement');
    sendSuccess(res, agreement);
  } catch (error) {
    next(error);
  }
});

// Update agreement status
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const agreement = await RentalAgreement.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!agreement) throw new NotFoundError('Rental Agreement');
    sendSuccess(res, agreement, 'Status updated');
  } catch (error) {
    next(error);
  }
});

// Renew agreement
router.post('/:id/renew', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const agreement = await RentalAgreement.findById(req.params.id);
    if (!agreement) throw new NotFoundError('Rental Agreement');

    agreement.renewalHistory.push({
      renewedOn: new Date(),
      newEnd: new Date(req.body.newEnd),
      newRent: req.body.newRent || agreement.monthlyRent,
    });
    agreement.leaseEnd = new Date(req.body.newEnd);
    if (req.body.newRent) agreement.monthlyRent = req.body.newRent;
    agreement.status = GlobalStatus.IN_PROGRESS;
    await agreement.save();

    sendSuccess(res, agreement, 'Agreement renewed');
  } catch (error) {
    next(error);
  }
});

export default router;
