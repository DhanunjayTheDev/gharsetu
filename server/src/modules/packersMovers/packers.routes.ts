import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus } from '../../shared/types';
import { PackersBooking } from './packers.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const addressSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(5).max(10),
});

const createBookingSchema = z.object({
  pickupAddress: addressSchema,
  dropAddress: addressSchema,
  scheduledDate: z.string().datetime(),
  scheduledTime: z.string().min(1),
  items: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
    category: z.string().optional(),
  })).min(1),
  vehicleType: z.enum(['mini', 'small', 'medium', 'large']).optional(),
  specialInstructions: z.string().max(500).optional(),
});

// Cost estimation helper
const estimateCost = (items: any[], vehicleType: string): number => {
  const baseRate: Record<string, number> = { mini: 2000, small: 4000, medium: 7000, large: 12000 };
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  return baseRate[vehicleType] + (totalItems * 200);
};

// Create booking
router.post('/', authenticate, validate(createBookingSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const estimatedCost = estimateCost(req.body.items, req.body.vehicleType || 'medium');
      const booking = await PackersBooking.create({
        ...req.body,
        customer: req.user!.userId,
        estimatedCost,
      });
      sendSuccess(res, booking, 'Booking created', 201);
    } catch (error) { next(error); }
  }
);

// Get cost estimate (no auth required)
router.post('/estimate', async (req, res, next) => {
  try {
    const { items, vehicleType } = req.body;
    const cost = estimateCost(items || [], vehicleType || 'medium');
    sendSuccess(res, { estimatedCost: cost });
  } catch (error) { next(error); }
});

// My bookings (customer)
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const [bookings, total] = await Promise.all([
      PackersBooking.find({ customer: req.user!.userId })
        .populate('provider', 'firstName lastName phone')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      PackersBooking.countDocuments({ customer: req.user!.userId }),
    ]);
    sendPaginated(res, bookings, total, page, limit);
  } catch (error) { next(error); }
});

// Provider: available bookings
router.get('/available', authenticate, authorize(UserRole.PACKERS_MOVERS),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req);
      const filter = { status: GlobalStatus.PENDING, provider: { $exists: false } };
      const [bookings, total] = await Promise.all([
        PackersBooking.find(filter)
          .populate('customer', 'firstName lastName phone')
          .skip(skip).limit(limit).sort({ scheduledDate: 1 }),
        PackersBooking.countDocuments(filter),
      ]);
      sendPaginated(res, bookings, total, page, limit);
    } catch (error) { next(error); }
  }
);

// Provider: accept booking
router.patch('/:id/accept', authenticate, authorize(UserRole.PACKERS_MOVERS),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await PackersBooking.findOneAndUpdate(
        { _id: req.params.id, status: GlobalStatus.PENDING, provider: { $exists: false } },
        { provider: req.user!.userId, status: GlobalStatus.IN_PROGRESS },
        { new: true }
      );
      if (!booking) throw new NotFoundError('Booking');
      sendSuccess(res, booking, 'Booking accepted');
    } catch (error) { next(error); }
  }
);

// Update status
router.patch('/:id/status', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const update: Record<string, any> = { status: req.body.status };
      if (req.body.status === GlobalStatus.COMPLETED) update.completedAt = new Date();
      if (req.body.finalCost) update.finalCost = req.body.finalCost;

      const booking = await PackersBooking.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!booking) throw new NotFoundError('Booking');
      sendSuccess(res, booking, 'Status updated');
    } catch (error) { next(error); }
  }
);

// Get single booking
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await PackersBooking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone');
    if (!booking) throw new NotFoundError('Booking');
    sendSuccess(res, booking);
  } catch (error) { next(error); }
});

export default router;
