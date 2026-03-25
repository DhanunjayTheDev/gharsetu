declare const config: {
    readonly env: string;
    readonly port: number;
    readonly clientUrl: string;
    readonly mongodb: {
        readonly uri: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshSecret: string;
        readonly refreshExpiresIn: string;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly cloudinary: {
        readonly cloudName: string;
        readonly apiKey: string;
        readonly apiSecret: string;
    };
    readonly email: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly pass: string;
        readonly from: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly max: number;
    };
};
export default config;
//# sourceMappingURL=index.d.ts.map