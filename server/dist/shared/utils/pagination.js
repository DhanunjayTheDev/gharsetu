"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSorting = exports.parsePagination = void 0;
const parsePagination = (req) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    return { page, limit, skip: (page - 1) * limit };
};
exports.parsePagination = parsePagination;
const parseSorting = (req, allowedFields) => {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    if (sortField && allowedFields.includes(sortField)) {
        return { [sortField]: sortOrder };
    }
    return { createdAt: -1 };
};
exports.parseSorting = parseSorting;
//# sourceMappingURL=pagination.js.map