"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../shared/utils/response");
exports.authController = {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            (0, response_1.sendSuccess)(res, result, 'Registration successful', 201);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    },
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refreshToken(refreshToken);
            (0, response_1.sendSuccess)(res, result, 'Token refreshed');
        }
        catch (error) {
            next(error);
        }
    },
    async logout(req, res, next) {
        try {
            await auth_service_1.authService.logout(req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (error) {
            next(error);
        }
    },
    async forgotPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.forgotPassword(req.body.email);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.resetPassword(req.body.token, req.body.password);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    },
    async getProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.getProfile(req.user.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    },
    async updateProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.updateProfile(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, user, 'Profile updated');
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map