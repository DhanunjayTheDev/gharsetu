import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { ScheduleType, GlobalStatus } from '../../shared/types';
import { Schedule } from './schedule.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError, ValidationError } from '../../shared/utils/errors';

const router = Router();

const createScheduleSchema = z.object({
  type: z.nativeEnum(ScheduleType),
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  attendee: z.string().min(1),
  relatedEntity: z.object({
    entityType: z.enum(['Property', 'LegalCase', 'PackersBooking', 'PropertyManagement']),
    entityId: z.string().min(1),
  }).optional(),
  date: z.string().datetime(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().optional(),
  meetingLink: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

// Check availability
const checkAvailability = async (attendeeId: string, date: Date, startTime: string, endTime: string, excludeId?: string) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const filter: Record<string, any> = {
    attendee: attendeeId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: GlobalStatus.CANCELLED },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    ],
  };
  if (excludeId) filter._id = { $ne: excludeId };

  const conflict = await Schedule.findOne(filter);
  return !conflict;
};

// Create schedule
router.post('/', authenticate, validate(createScheduleSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isAvailable = await checkAvailability(
        req.body.attendee, new Date(req.body.date), req.body.startTime, req.body.endTime
      );
      if (!isAvailable) throw new ValidationError('Time slot is not available');

      const schedule = await Schedule.create({ ...req.body, organizer: req.user!.userId });
      sendSuccess(res, schedule, 'Schedule created', 201);
    } catch (error) { next(error); }
  }
);

// Get my schedules
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter: Record<string, any> = { $or: [{ organizer: userId }, { attendee: userId }] };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from) filter.date = { $gte: new Date(req.query.from as string) };
    if (req.query.to) {
      filter.date = { ...filter.date, $lte: new Date(req.query.to as string) };
    }

    const [schedules, total] = await Promise.all([
      Schedule.find(filter)
        .populate('organizer', 'firstName lastName')
        .populate('attendee', 'firstName lastName')
        .skip(skip).limit(limit).sort({ date: 1 }),
      Schedule.countDocuments(filter),
    ]);
    sendPaginated(res, schedules, total, page, limit);
  } catch (error) { next(error); }
});

// Get availability slots for a date
router.get('/availability/:userId', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      if (!date) throw new ValidationError('Date is required');

      const dayStart = new Date(date as string);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date as string);
      dayEnd.setHours(23, 59, 59, 999);

      const booked = await Schedule.find({
        attendee: req.params.userId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $ne: GlobalStatus.CANCELLED },
      }).select('startTime endTime');

      // Generate available slots (9 AM to 6 PM, 1 hour slots)
      const allSlots = [];
      for (let h = 9; h < 18; h++) {
        const start = `${String(h).padStart(2, '0')}:00`;
        const end = `${String(h + 1).padStart(2, '0')}:00`;
        const isBooked = booked.some((b) => b.startTime < end && b.endTime > start);
        allSlots.push({ start, end, available: !isBooked });
      }

      sendSuccess(res, allSlots);
    } catch (error) { next(error); }
  }
);

// Get single schedule
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('organizer', 'firstName lastName email phone')
      .populate('attendee', 'firstName lastName email phone');
    if (!schedule) throw new NotFoundError('Schedule');
    sendSuccess(res, schedule);
  } catch (error) { next(error); }
});

// Update status (confirm/cancel)
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const update: Record<string, any> = { status: req.body.status };
    if (req.body.status === GlobalStatus.CANCELLED) update.cancellationReason = req.body.reason;

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!schedule) throw new NotFoundError('Schedule');
    sendSuccess(res, schedule, 'Schedule updated');
  } catch (error) { next(error); }
});

// Reschedule
router.patch('/:id/reschedule', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const isAvailable = await checkAvailability(
      req.body.attendee, new Date(req.body.date), req.body.startTime, req.body.endTime, req.params.id
    );
    if (!isAvailable) throw new ValidationError('New time slot is not available');

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    }, { new: true });
    if (!schedule) throw new NotFoundError('Schedule');
    sendSuccess(res, schedule, 'Rescheduled');
  } catch (error) { next(error); }
});

export default router;
