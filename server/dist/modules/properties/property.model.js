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
exports.Property = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../shared/types");
const propertySchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    type: { type: String, enum: Object.values(types_1.PropertyType), required: true, index: true },
    purpose: { type: String, enum: Object.values(types_1.PropertyPurpose), required: true, index: true },
    status: {
        type: String,
        enum: Object.values(types_1.PropertyStatus),
        default: types_1.PropertyStatus.DRAFT,
        index: true,
    },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price: { type: Number, required: true, index: true },
    priceUnit: { type: String, enum: ['total', 'per_sqft', 'per_month'], default: 'total' },
    area: {
        value: { type: Number, required: true },
        unit: { type: String, enum: ['sqft', 'sqm', 'acres', 'hectares'], default: 'sqft' },
    },
    bedrooms: Number,
    bathrooms: Number,
    floors: Number,
    yearBuilt: Number,
    furnishing: { type: String, enum: ['unfurnished', 'semi_furnished', 'fully_furnished'] },
    amenities: [String],
    images: [String],
    documents: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Document' }],
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
        address: { type: String, required: true },
        city: { type: String, required: true, index: true },
        state: { type: String, required: true, index: true },
        pincode: { type: String, required: true },
        locality: { type: String, index: true },
        landmark: String,
    },
    features: {
        parking: { type: Boolean, default: false },
        garden: { type: Boolean, default: false },
        pool: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        powerBackup: { type: Boolean, default: false },
        waterSupply: { type: Boolean, default: false },
    },
    verification: {
        isVerified: { type: Boolean, default: false },
        verifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        verifiedAt: Date,
        legalCaseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'LegalCase' },
    },
    views: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    availableFrom: Date,
}, { timestamps: true });
// GeoJSON index for location-based search
propertySchema.index({ 'location.coordinates': '2dsphere' });
// Compound indexes for common queries
propertySchema.index({ purpose: 1, type: 1, status: 1, price: 1 });
propertySchema.index({ 'location.city': 1, purpose: 1, status: 1 });
// Text search index
propertySchema.index({ title: 'text', description: 'text', 'location.address': 'text', 'location.locality': 'text' });
exports.Property = mongoose_1.default.model('Property', propertySchema);
//# sourceMappingURL=property.model.js.map