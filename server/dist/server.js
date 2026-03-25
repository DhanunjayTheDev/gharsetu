"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("./config"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const cloudinary_1 = require("./config/cloudinary");
const errorHandler_1 = require("./shared/middleware/errorHandler");
const logger_1 = __importDefault(require("./shared/utils/logger"));
// Import routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const property_routes_1 = __importDefault(require("./modules/properties/property.routes"));
const inquiry_routes_1 = __importDefault(require("./modules/inquiries/inquiry.routes"));
const buySell_routes_1 = __importDefault(require("./modules/buySell/buySell.routes"));
const rental_routes_1 = __importDefault(require("./modules/rental/rental.routes"));
const propertyManagement_routes_1 = __importDefault(require("./modules/propertyManagement/propertyManagement.routes"));
const legal_routes_1 = __importDefault(require("./modules/legal/legal.routes"));
const jv_routes_1 = __importDefault(require("./modules/jointVenture/jv.routes"));
const packers_routes_1 = __importDefault(require("./modules/packersMovers/packers.routes"));
const marketing_routes_1 = __importDefault(require("./modules/marketing/marketing.routes"));
const schedule_routes_1 = __importDefault(require("./modules/scheduling/schedule.routes"));
const feedback_routes_1 = __importDefault(require("./modules/feedback/feedback.routes"));
const notification_routes_1 = __importDefault(require("./modules/notifications/notification.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const document_routes_1 = __importDefault(require("./modules/documents/document.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const app = (0, express_1.default)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Ensure logs directory exists
const logsDir = path_1.default.join(__dirname, '..', 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.default.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting
app.use((0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.max,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
// Logging
if (config_1.default.env !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: { write: (message) => logger_1.default.info(message.trim()) },
    }));
}
// Static files
app.use('/uploads', express_1.default.static(uploadsDir));
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/properties', property_routes_1.default);
app.use('/api/inquiries', inquiry_routes_1.default);
app.use('/api/offers', buySell_routes_1.default);
app.use('/api/rentals', rental_routes_1.default);
app.use('/api/property-management', propertyManagement_routes_1.default);
app.use('/api/legal', legal_routes_1.default);
app.use('/api/joint-ventures', jv_routes_1.default);
app.use('/api/packers', packers_routes_1.default);
app.use('/api/marketing', marketing_routes_1.default);
app.use('/api/schedules', schedule_routes_1.default);
app.use('/api/feedback', feedback_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/documents', document_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Error handler
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        await (0, redis_1.connectRedis)();
        (0, cloudinary_1.configureCloudinary)();
        app.listen(config_1.default.port, () => {
            logger_1.default.info(`🏠 Ghar Setu API running on port ${config_1.default.port} [${config_1.default.env}]`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map