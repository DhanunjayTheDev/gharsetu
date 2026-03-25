"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../shared/utils/logger"));
const configureCloudinary = () => {
    if (config_1.default.cloudinary.cloudName) {
        cloudinary_1.v2.config({
            cloud_name: config_1.default.cloudinary.cloudName,
            api_key: config_1.default.cloudinary.apiKey,
            api_secret: config_1.default.cloudinary.apiSecret,
        });
        logger_1.default.info('Cloudinary configured');
    }
    else {
        logger_1.default.warn('Cloudinary not configured - file uploads will be stored locally');
    }
};
exports.configureCloudinary = configureCloudinary;
const uploadToCloudinary = async (filePath, folder) => {
    const result = await cloudinary_1.v2.uploader.upload(filePath, {
        folder: `gharsetu/${folder}`,
        resource_type: 'auto',
    });
    return { url: result.secure_url, publicId: result.public_id };
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    await cloudinary_1.v2.uploader.destroy(publicId);
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map