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
exports.JointVenture = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../shared/types");
const jvSchema = new mongoose_1.Schema({
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 5000 },
    landowner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    builder: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property' },
    stage: {
        type: String,
        enum: Object.values(types_1.JVStage),
        default: types_1.JVStage.PROPOSAL,
        index: true,
    },
    status: {
        type: String,
        enum: Object.values(types_1.GlobalStatus),
        default: types_1.GlobalStatus.PENDING,
    },
    landDetails: {
        area: { type: Number, required: true },
        areaUnit: { type: String, default: 'sqft' },
        location: { type: String, required: true },
        surveyNumber: String,
    },
    terms: {
        landOwnerShare: { type: Number, required: true },
        builderShare: { type: Number, required: true },
        estimatedUnits: Number,
        estimatedCost: Number,
        timeline: String,
    },
    documents: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Document' }],
    milestones: [{
            title: { type: String, required: true },
            description: String,
            targetDate: Date,
            completedDate: Date,
            status: { type: String, enum: Object.values(types_1.GlobalStatus), default: types_1.GlobalStatus.PENDING },
        }],
}, { timestamps: true });
exports.JointVenture = mongoose_1.default.model('JointVenture', jvSchema);
//# sourceMappingURL=jv.model.js.map