"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheDel = exports.cacheSet = exports.cacheGet = exports.getRedis = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../shared/utils/logger"));
let redis = null;
const connectRedis = async () => {
    try {
        redis = new ioredis_1.default(config_1.default.redis.url, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 3)
                    return null;
                return Math.min(times * 200, 2000);
            },
        });
        redis.on('connect', () => logger_1.default.info('Redis connected'));
        redis.on('error', (err) => logger_1.default.warn('Redis error (non-fatal):', err.message));
        return redis;
    }
    catch (error) {
        logger_1.default.warn('Redis connection failed, running without cache');
        return null;
    }
};
exports.connectRedis = connectRedis;
const getRedis = () => redis;
exports.getRedis = getRedis;
const cacheGet = async (key) => {
    if (!redis)
        return null;
    try {
        return await redis.get(key);
    }
    catch {
        return null;
    }
};
exports.cacheGet = cacheGet;
const cacheSet = async (key, value, ttlSeconds = 300) => {
    if (!redis)
        return;
    try {
        await redis.setex(key, ttlSeconds, value);
    }
    catch {
        // Cache write failure is non-fatal
    }
};
exports.cacheSet = cacheSet;
const cacheDel = async (pattern) => {
    if (!redis)
        return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
    catch {
        // Cache delete failure is non-fatal
    }
};
exports.cacheDel = cacheDel;
//# sourceMappingURL=redis.js.map