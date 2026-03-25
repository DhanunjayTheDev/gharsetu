"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const auth_model_1 = require("./auth.model");
const config_1 = __importDefault(require("../../config"));
const errors_1 = require("../../shared/utils/errors");
const SALT_ROUNDS = 12;
const generateTokens = (user) => {
    const payload = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expiresIn,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt.refreshSecret, {
        expiresIn: config_1.default.jwt.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
};
exports.authService = {
    async register(input) {
        const existing = await auth_model_1.User.findOne({ email: input.email });
        if (existing) {
            throw new errors_1.ConflictError('Email already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = await auth_model_1.User.create({
            ...input,
            password: hashedPassword,
        });
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return {
            user: user.toJSON(),
            ...tokens,
        };
    },
    async login(input) {
        const user = await auth_model_1.User.findOne({ email: input.email }).select('+password');
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
            throw new errors_1.UnauthorizedError('Account is deactivated');
        }
        const isMatch = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isMatch) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();
        return {
            user: user.toJSON(),
            ...tokens,
        };
    },
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.refreshSecret);
            const user = await auth_model_1.User.findById(decoded.userId).select('+refreshToken');
            if (!user || user.refreshToken !== refreshToken) {
                throw new errors_1.UnauthorizedError('Invalid refresh token');
            }
            const tokens = generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();
            return tokens;
        }
        catch {
            throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
    },
    async logout(userId) {
        await auth_model_1.User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    },
    async forgotPassword(email) {
        const user = await auth_model_1.User.findOne({ email });
        if (!user) {
            // Don't reveal whether user exists
            return { message: 'If email exists, a reset link has been sent' };
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        // TODO: Send email with resetToken
        return { message: 'If email exists, a reset link has been sent' };
    },
    async resetPassword(token, newPassword) {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await auth_model_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        }).select('+resetPasswordToken +resetPasswordExpires');
        if (!user) {
            throw new errors_1.ValidationError('Invalid or expired reset token');
        }
        user.password = await bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return { message: 'Password reset successful' };
    },
    async getProfile(userId) {
        const user = await auth_model_1.User.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User');
        return user;
    },
    async updateProfile(userId, input) {
        const user = await auth_model_1.User.findByIdAndUpdate(userId, { $set: input }, { new: true, runValidators: true });
        if (!user)
            throw new errors_1.NotFoundError('User');
        return user;
    },
    async changePassword(userId, currentPassword, newPassword) {
        const user = await auth_model_1.User.findById(userId).select('+password');
        if (!user)
            throw new errors_1.NotFoundError('User');
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            throw new errors_1.ValidationError('Current password is incorrect');
        user.password = await bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
        await user.save();
        return { message: 'Password changed successfully' };
    },
};
//# sourceMappingURL=auth.service.js.map