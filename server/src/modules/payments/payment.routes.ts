import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, PaymentStatus } from '../../shared/types';
import { Payment } from './payment.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';
import crypto from 'crypto';

const router = Router();

const createPaymentSchema = z.object({
  payee: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().min(5),
  type: z.enum(['service_fee', 'commission', 'rent', 'deposit', 'consultation_fee', 'booking_fee']),
  relatedEntity: z.object({
    entityType: z.string(),
    entityId: z.string(),
  }).optional(),
  paymentMethod: z.string().optional(),
});

// Initiate payment
router.post('/', authenticate, validate(createPaymentSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const payment = await Payment.create({
        ...req.body,
        payer: req.user!.userId,
        transactionId: `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      });
      sendSuccess(res, payment, 'Payment initiated', 201);
    } catch (error) { next(error); }
  }
);

// My payments
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter: Record<string, any> = { $or: [{ payer: userId }, { payee: userId }] };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('payer', 'firstName lastName')
        .populate('payee', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Payment.countDocuments(filter),
    ]);
    sendPaginated(res, payments, total, page, limit);
  } catch (error) { next(error); }
});

// Get single payment
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('payer', 'firstName lastName email')
      .populate('payee', 'firstName lastName email');
    if (!payment) throw new NotFoundError('Payment');
    sendSuccess(res, payment);
  } catch (error) { next(error); }
});

// Complete payment (webhook simulation)
router.patch('/:id/complete', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const payment = await Payment.findByIdAndUpdate(req.params.id, {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      }, { new: true });
      if (!payment) throw new NotFoundError('Payment');
      sendSuccess(res, payment, 'Payment completed');
    } catch (error) { next(error); }
  }
);

// Refund
router.patch('/:id/refund', authenticate, authorize(UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const payment = await Payment.findByIdAndUpdate(req.params.id, {
        status: PaymentStatus.REFUNDED,
      }, { new: true });
      if (!payment) throw new NotFoundError('Payment');
      sendSuccess(res, payment, 'Payment refunded');
    } catch (error) { next(error); }
  }
);

// Admin: all payments
router.get('/', authenticate, authorize(UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req);
      const filter: Record<string, any> = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.type) filter.type = req.query.type;

      const [payments, total] = await Promise.all([
        Payment.find(filter)
          .populate('payer', 'firstName lastName')
          .populate('payee', 'firstName lastName')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        Payment.countDocuments(filter),
      ]);
      sendPaginated(res, payments, total, page, limit);
    } catch (error) { next(error); }
  }
);

export default router;
