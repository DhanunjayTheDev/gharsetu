"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../shared/utils/logger"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_1.default.mongodb.uri);
        logger_1.default.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.default.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    logger_1.default.warn('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    logger_1.default.error('MongoDB error:', err);
});
//# sourceMappingURL=database.js.map