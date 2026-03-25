import { Request, Response, NextFunction } from 'express';
import { TokenPayload, UserRole } from '../types';
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}
export declare const authenticate: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: UserRole[]) => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map