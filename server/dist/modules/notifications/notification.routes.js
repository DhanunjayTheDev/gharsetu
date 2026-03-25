"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const express_1 = require("express");
const auth_1 = require("../../shared/middleware/auth");
const notification_model_1 = require("./notification.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const router = (0, express_1.Router)();
// Helper to create notification (used by other modules)
const createNotification = async (data) => {
    return notification_model_1.Notification.create({
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
exports.createNotification = createNotification;
// Get my notifications
router.get('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = { recipient: req.user.userId };
        if (req.query.unreadOnly === 'true')
            filter.isRead = false;
        const [notifications, total, unreadCount] = await Promise.all([
            notification_model_1.Notification.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            notification_model_1.Notification.countDocuments(filter),
            notification_model_1.Notification.countDocuments({ recipient: req.user.userId, isRead: false }),
        ]);
        (0, response_1.sendSuccess)(res, { notifications, unreadCount, total, page, limit });
    }
    catch (error) {
        next(error);
    }
});
// Mark as read
router.patch('/:id/read', auth_1.authenticate, async (req, res, next) => {
    try {
        await notification_model_1.Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user.userId }, { isRead: true, readAt: new Date() });
        (0, response_1.sendSuccess)(res, null, 'Marked as read');
    }
    catch (error) {
        next(error);
    }
});
// Mark all as read
router.patch('/read-all', auth_1.authenticate, async (req, res, next) => {
    try {
        await notification_model_1.Notification.updateMany({ recipient: req.user.userId, isRead: false }, { isRead: true, readAt: new Date() });
        (0, response_1.sendSuccess)(res, null, 'All marked as read');
    }
    catch (error) {
        next(error);
    }
});
// Delete notification
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        await notification_model_1.Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.userId });
        (0, response_1.sendSuccess)(res, null, 'Notification deleted');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map