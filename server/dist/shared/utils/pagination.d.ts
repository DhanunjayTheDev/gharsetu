import { Request } from 'express';
export interface PaginationQuery {
    page: number;
    limit: number;
    skip: number;
}
export declare const parsePagination: (req: Request) => PaginationQuery;
export declare const parseSorting: (req: Request, allowedFields: string[]) => Record<string, 1 | -1>;
//# sourceMappingURL=pagination.d.ts.map