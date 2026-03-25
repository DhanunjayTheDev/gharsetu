import { NotificationType } from '../../shared/types';
declare const router: import("express-serve-static-core").Router;
export declare const createNotification: (data: {
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
    link?: string;
}) => Promise<import("mongoose").Document<unknown, {}, import("./notification.model").INotification, {}, {}> & import("./notification.model").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export default router;
//# sourceMappingURL=notification.routes.d.ts.map