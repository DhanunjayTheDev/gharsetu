import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../shared/middleware/auth';
import { NotificationType } from '../../shared/types';
import { Notification } from './notification.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';

const router = Router();

// Helper to create notification (used by other modules)
export const createNotification = async (data: {
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  link?: string;
}) => {
  return Notification.create({
    recipient: data.recipient,
    type: data.type,
    title: data.title,
    message: data.message,
    data: {
      entityType: data.entityType,
      entityId: data.entityId,
      link: data.link,
    },
  });
};

// Get my notifications
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter: Record<string, any> = { recipient: req.user!.userId };
    if (req.query.unreadOnly === 'true') filter.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user!.userId, isRead: false }),
    ]);

    sendSuccess(res, { notifications, unreadCount, total, page, limit });
  } catch (error) { next(error); }
});

// Mark as read
router.patch('/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user!.userId },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, null, 'Marked as read');
  } catch (error) { next(error); }
});

// Mark all as read
router.patch('/read-all', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, null, 'All marked as read');
  } catch (error) { next(error); }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user!.userId });
    sendSuccess(res, null, 'Notification deleted');
  } catch (error) { next(error); }
});

export default router;
