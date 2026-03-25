"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const schedule_model_1 = require("./schedule.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createScheduleSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(types_1.ScheduleType),
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().max(1000).optional(),
    attendee: zod_1.z.string().min(1),
    relatedEntity: zod_1.z.object({
        entityType: zod_1.z.enum(['Property', 'LegalCase', 'PackersBooking', 'PropertyManagement']),
        entityId: zod_1.z.string().min(1),
    }).optional(),
    date: zod_1.z.string().datetime(),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    location: zod_1.z.string().optional(),
    meetingLink: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Check availability
const checkAvailability = async (attendeeId, date, startTime, endTime, excludeId) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const filter = {
        attendee: attendeeId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $ne: types_1.GlobalStatus.CANCELLED },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
    };
    if (excludeId)
        filter._id = { $ne: excludeId };
    const conflict = await schedule_model_1.Schedule.findOne(filter);
    return !conflict;
};
// Create schedule
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createScheduleSchema), async (req, res, next) => {
    try {
        const isAvailable = await checkAvailability(req.body.attendee, new Date(req.body.date), req.body.startTime, req.body.endTime);
        if (!isAvailable)
            throw new errors_1.ValidationError('Time slot is not available');
        const schedule = await schedule_model_1.Schedule.create({ ...req.body, organizer: req.user.userId });
        (0, response_1.sendSuccess)(res, schedule, 'Schedule created', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my schedules
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const userId = req.user.userId;
        const filter = { $or: [{ organizer: userId }, { attendee: userId }] };
        if (req.query.type)
            filter.type = req.query.type;
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.from)
            filter.date = { $gte: new Date(req.query.from) };
        if (req.query.to) {
            filter.date = { ...filter.date, $lte: new Date(req.query.to) };
        }
        const [schedules, total] = await Promise.all([
            schedule_model_1.Schedule.find(filter)
                .populate('organizer', 'firstName lastName')
                .populate('attendee', 'firstName lastName')
                .skip(skip).limit(limit).sort({ date: 1 }),
            schedule_model_1.Schedule.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, schedules, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get availability slots for a date
router.get('/availability/:userId', auth_1.authenticate, async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!date)
            throw new errors_1.ValidationError('Date is required');
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const booked = await schedule_model_1.Schedule.find({
            attendee: req.params.userId,
            date: { $gte: dayStart, $lte: dayEnd },
            status: { $ne: types_1.GlobalStatus.CANCELLED },
        }).select('startTime endTime');
        // Generate available slots (9 AM to 6 PM, 1 hour slots)
        const allSlots = [];
        for (let h = 9; h < 18; h++) {
            const start = `${String(h).padStart(2, '0')}:00`;
            const end = `${String(h + 1).padStart(2, '0')}:00`;
            const isBooked = booked.some((b) => b.startTime < end && b.endTime > start);
            allSlots.push({ start, end, available: !isBooked });
        }
        (0, response_1.sendSuccess)(res, allSlots);
    }
    catch (error) {
        next(error);
    }
});
// Get single schedule
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const schedule = await schedule_model_1.Schedule.findById(req.params.id)
            .populate('organizer', 'firstName lastName email phone')
            .populate('attendee', 'firstName lastName email phone');
        if (!schedule)
            throw new errors_1.NotFoundError('Schedule');
        (0, response_1.sendSuccess)(res, schedule);
    }
    catch (error) {
        next(error);
    }
});
// Update status (confirm/cancel)
router.patch('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const update = { status: req.body.status };
        if (req.body.status === types_1.GlobalStatus.CANCELLED)
            update.cancellationReason = req.body.reason;
        const schedule = await schedule_model_1.Schedule.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!schedule)
            throw new errors_1.NotFoundError('Schedule');
        (0, response_1.sendSuccess)(res, schedule, 'Schedule updated');
    }
    catch (error) {
        next(error);
    }
});
// Reschedule
router.patch('/:id/reschedule', auth_1.authenticate, async (req, res, next) => {
    try {
        const isAvailable = await checkAvailability(req.body.attendee, new Date(req.body.date), req.body.startTime, req.body.endTime, req.params.id);
        if (!isAvailable)
            throw new errors_1.ValidationError('New time slot is not available');
        const schedule = await schedule_model_1.Schedule.findByIdAndUpdate(req.params.id, {
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
        }, { new: true });
        if (!schedule)
            throw new errors_1.NotFoundError('Schedule');
        (0, response_1.sendSuccess)(res, schedule, 'Rescheduled');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=schedule.routes.js.map