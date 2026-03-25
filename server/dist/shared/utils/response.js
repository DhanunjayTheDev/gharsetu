"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendPaginated = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendPaginated = (res, data, total, page, limit, message = 'Success') => {
    const response = {
        success: true,
        message,
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
    return res.status(200).json(response);
};
exports.sendPaginated = sendPaginated;
const sendError = (res, message, statusCode = 500) => {
    const response = {
        success: false,
        message,
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map