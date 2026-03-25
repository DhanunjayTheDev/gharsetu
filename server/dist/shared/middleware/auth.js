"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const errors_1 = require("../utils/errors");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new errors_1.UnauthorizedError('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        req.user = decoded;
        next();
    }
    catch {
        throw new errors_1.UnauthorizedError('Invalid or expired token');
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError();
        }
        if (!roles.includes(req.user.role)) {
            throw new errors_1.ForbiddenError('You do not have permission to perform this action');
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            req.user = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        }
        catch {
            // Token invalid, continue without auth
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map