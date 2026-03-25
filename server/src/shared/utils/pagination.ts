import { Request } from 'express';

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (req: Request): PaginationQuery => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

export const parseSorting = (req: Request, allowedFields: string[]): Record<string, 1 | -1> => {
  const sortField = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  if (sortField && allowedFields.includes(sortField)) {
    return { [sortField]: sortOrder };
  }
  return { createdAt: -1 };
};
