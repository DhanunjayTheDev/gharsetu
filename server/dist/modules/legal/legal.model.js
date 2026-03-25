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
exports.LegalCase = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../shared/types");
const legalCaseSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(types_1.LegalCaseType), required: true, index: true },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    advisor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property', index: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    status: {
        type: String,
        enum: Object.values(types_1.GlobalStatus),
        default: types_1.GlobalStatus.PENDING,
        index: true,
    },
    documents: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Document' }],
    timeline: [{
            event: { type: String, required: true },
            description: String,
            date: { type: Date, default: Date.now },
            addedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        }],
    consultationDate: Date,
    fee: Number,
    notes: String,
}, { timestamps: true });
exports.LegalCase = mongoose_1.default.model('LegalCase', legalCaseSchema);
//# sourceMappingURL=legal.model.js.map