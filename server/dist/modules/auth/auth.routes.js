"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerSchema), auth_controller_1.authController.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
router.post('/refresh-token', (0, validate_1.validate)(auth_validation_1.refreshTokenSchema), auth_controller_1.authController.refreshToken);
router.post('/forgot-password', (0, validate_1.validate)(auth_validation_1.forgotPasswordSchema), auth_controller_1.authController.forgotPassword);
router.post('/reset-password', (0, validate_1.validate)(auth_validation_1.resetPasswordSchema), auth_controller_1.authController.resetPassword);
// Protected routes
router.post('/logout', auth_1.authenticate, auth_controller_1.authController.logout);
router.get('/profile', auth_1.authenticate, auth_controller_1.authController.getProfile);
router.patch('/profile', auth_1.authenticate, (0, validate_1.validate)(auth_validation_1.updateProfileSchema), auth_controller_1.authController.updateProfile);
router.post('/change-password', auth_1.authenticate, auth_controller_1.authController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map