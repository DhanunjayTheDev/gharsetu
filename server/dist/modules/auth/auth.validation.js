"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../../shared/types");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).trim(),
    lastName: zod_1.z.string().min(1).max(50).trim(),
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    phone: zod_1.z.string().min(10).max(15),
    role: zod_1.z.nativeEnum(types_1.UserRole).optional().default(types_1.UserRole.BUYER),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8),
});
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).trim().optional(),
    lastName: zod_1.z.string().min(1).max(50).trim().optional(),
    phone: zod_1.z.string().min(10).max(15).optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        pincode: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
    })
        .optional(),
    preferences: zod_1.z
        .object({
        language: zod_1.z.string().optional(),
        notifications: zod_1.z
            .object({
            email: zod_1.z.boolean().optional(),
            inApp: zod_1.z.boolean().optional(),
        })
            .optional(),
    })
        .optional(),
});
//# sourceMappingURL=auth.validation.js.map