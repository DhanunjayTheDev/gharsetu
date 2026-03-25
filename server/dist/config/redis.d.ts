import Redis from 'ioredis';
export declare const connectRedis: () => Promise<Redis | null>;
export declare const getRedis: () => Redis | null;
export declare const cacheGet: (key: string) => Promise<string | null>;
export declare const cacheSet: (key: string, value: string, ttlSeconds?: number) => Promise<void>;
export declare const cacheDel: (pattern: string) => Promise<void>;
//# sourceMappingURL=redis.d.ts.map