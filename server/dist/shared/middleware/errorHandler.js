"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const config_1 = __importDefault(require("../../config"));
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof errors_1.AppError) {
        (0, response_1.sendError)(res, err.message, err.statusCode);
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        (0, response_1.sendError)(res, err.message, 400);
        return;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        (0, response_1.sendError)(res, `Duplicate value for field: ${field}`, 409);
        return;
    }
    // Mongoose cast error
    if (err.name === 'CastError') {
        (0, response_1.sendError)(res, 'Invalid ID format', 400);
        return;
    }
    logger_1.default.error('Unhandled error:', err);
    (0, response_1.sendError)(res, config_1.default.env === 'production' ? 'Internal server error' : err.message, 500);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map