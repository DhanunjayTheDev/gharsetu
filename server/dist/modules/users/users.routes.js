"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const types_1 = require("../../shared/types");
const auth_model_1 = require("../auth/auth.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// All user routes require admin
router.use(auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN));
// List users
router.get('/', async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {};
        if (req.query.role)
            filter.role = req.query.role;
        if (req.query.isActive)
            filter.isActive = req.query.isActive === 'true';
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        const [users, total] = await Promise.all([
            auth_model_1.User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            auth_model_1.User.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, users, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get user by ID
router.get('/:id', async (req, res, next) => {
    try {
        const user = await auth_model_1.User.findById(req.params.id);
        if (!user)
            throw new errors_1.NotFoundError('User');
        (0, response_1.sendSuccess)(res, user);
    }
    catch (error) {
        next(error);
    }
});
const updateUserSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(types_1.UserRole).optional(),
    isActive: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    'kyc.status': zod_1.z.enum(['pending', 'submitted', 'verified', 'rejected']).optional(),
});
// Update user (admin)
router.patch('/:id', (0, validate_1.validate)(updateUserSchema), async (req, res, next) => {
    try {
        const user = await auth_model_1.User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!user)
            throw new errors_1.NotFoundError('User');
        (0, response_1.sendSuccess)(res, user, 'User updated');
    }
    catch (error) {
        next(error);
    }
});
// Deactivate user
router.patch('/:id/deactivate', async (req, res, next) => {
    try {
        const user = await auth_model_1.User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user)
            throw new errors_1.NotFoundError('User');
        (0, response_1.sendSuccess)(res, user, 'User deactivated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map