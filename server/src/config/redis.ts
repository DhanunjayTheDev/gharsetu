import Redis from 'ioredis';
import config from '../config';
import logger from '../shared/utils/logger';

let redis: Redis | null = null;

export const connectRedis = async (): Promise<Redis | null> => {
  try {
    redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.warn('Redis error (non-fatal):', err.message));

    return redis;
  } catch (error) {
    logger.warn('Redis connection failed, running without cache');
    return null;
  }
};

export const getRedis = (): Redis | null => redis;

export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: string, ttlSeconds = 300): Promise<void> => {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    // Cache write failure is non-fatal
  }
};

export const cacheDel = async (pattern: string): Promise<void> => {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Cache delete failure is non-fatal
  }
};
