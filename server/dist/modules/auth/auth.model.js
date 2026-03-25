"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../shared/types");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: Object.values(types_1.UserRole),
        default: types_1.UserRole.BUYER,
        index: true,
    },
    avatar: String,
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
    kyc: {
        status: {
            type: String,
            enum: ['pending', 'submitted', 'verified', 'rejected'],
            default: 'pending',
        },
        documents: [String],
        verifiedAt: Date,
    },
    address: {
        street: String,
        city: { type: String, index: true },
        state: { type: String, index: true },
        pincode: String,
        country: { type: String, default: 'India' },
    },
    preferences: {
        language: { type: String, default: 'en' },
        notifications: {
            email: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true },
        },
    },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    lastLogin: Date,
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            const { password, refreshToken, resetPasswordToken, resetPasswordExpires, __v, ...rest } = ret;
            return rest;
        },
    },
});
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=auth.model.js.map