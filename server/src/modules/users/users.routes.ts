import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole } from '../../shared/types';
import { User } from '../auth/auth.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';
import { z } from 'zod';

const router = Router();

// All user routes require admin
router.use(authenticate, authorize(UserRole.ADMIN));

// List users
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter: Record<string, any> = {};

    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    sendPaginated(res, users, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
});

const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  'kyc.status': z.enum(['pending', 'submitted', 'verified', 'rejected']).optional(),
});

// Update user (admin)
router.patch('/:id', validate(updateUserSchema), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
});

// Deactivate user
router.patch('/:id/deactivate', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user, 'User deactivated');
  } catch (error) {
    next(error);
  }
});

export default router;
