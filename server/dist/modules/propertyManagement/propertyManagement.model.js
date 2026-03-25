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
exports.PropertyManagement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../shared/types");
const propertyManagementSchema = new mongoose_1.Schema({
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    manager: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
        type: String,
        enum: Object.values(types_1.GlobalStatus),
        default: types_1.GlobalStatus.PENDING,
    },
    monthlyFee: { type: Number, required: true },
    services: [{
            type: String,
            enum: ['rent_collection', 'maintenance', 'tenant_screening', 'inspections'],
        }],
    rentTracking: [{
            month: String,
            amount: Number,
            collected: { type: Boolean, default: false },
            collectedAt: Date,
        }],
    maintenanceRequests: [{
            title: { type: String, required: true },
            description: String,
            priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
            status: { type: String, enum: Object.values(types_1.GlobalStatus), default: types_1.GlobalStatus.PENDING },
            cost: Number,
            createdAt: { type: Date, default: Date.now },
            resolvedAt: Date,
        }],
    contractStart: { type: Date, required: true },
    contractEnd: { type: Date, required: true },
}, { timestamps: true });
exports.PropertyManagement = mongoose_1.default.model('PropertyManagement', propertyManagementSchema);
//# sourceMappingURL=propertyManagement.model.js.map