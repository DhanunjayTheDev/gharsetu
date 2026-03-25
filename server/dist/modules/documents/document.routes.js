"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../shared/middleware/auth");
const types_1 = require("../../shared/types");
const document_model_1 = require("./document.model");
const upload_1 = require("../../shared/middleware/upload");
const cloudinary_1 = require("../../config/cloudinary");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
// Upload document
router.post('/', auth_1.authenticate, upload_1.upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        let fileUrl = `/uploads/${file.filename}`;
        let cloudinaryId;
        // Try cloudinary upload
        try {
            const result = await (0, cloudinary_1.uploadToCloudinary)(file.path, 'documents');
            fileUrl = result.url;
            cloudinaryId = result.publicId;
        }
        catch {
            // Fallback to local storage
        }
        const doc = await document_model_1.DocumentModel.create({
            title: req.body.title || file.originalname,
            description: req.body.description,
            fileUrl,
            fileType: file.mimetype,
            fileSize: file.size,
            cloudinaryId,
            uploadedBy: req.user.userId,
            relatedEntity: {
                entityType: req.body.entityType,
                entityId: req.body.entityId,
            },
        });
        (0, response_1.sendSuccess)(res, doc, 'Document uploaded', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get documents for an entity
router.get('/entity/:entityType/:entityId', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const filter = {
            'relatedEntity.entityType': req.params.entityType,
            'relatedEntity.entityId': req.params.entityId,
        };
        const [docs, total] = await Promise.all([
            document_model_1.DocumentModel.find(filter)
                .populate('uploadedBy', 'firstName lastName')
                .populate('reviewedBy', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            document_model_1.DocumentModel.countDocuments(filter),
        ]);
        (0, response_1.sendPaginated)(res, docs, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Review document (admin/legal)
router.patch('/:id/review', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.LEGAL_ADVISOR), async (req, res, next) => {
    try {
        const update = {
            status: req.body.status,
            reviewedBy: req.user.userId,
            reviewedAt: new Date(),
        };
        if (req.body.status === types_1.DocumentStatus.REJECTED) {
            update.rejectionReason = req.body.rejectionReason;
        }
        const doc = await document_model_1.DocumentModel.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!doc)
            throw new errors_1.NotFoundError('Document');
        (0, response_1.sendSuccess)(res, doc, 'Document reviewed');
    }
    catch (error) {
        next(error);
    }
});
// Delete document
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const doc = await document_model_1.DocumentModel.findOne({ _id: req.params.id, uploadedBy: req.user.userId });
        if (!doc)
            throw new errors_1.NotFoundError('Document');
        if (doc.cloudinaryId) {
            await (0, cloudinary_1.deleteFromCloudinary)(doc.cloudinaryId);
        }
        await doc.deleteOne();
        (0, response_1.sendSuccess)(res, null, 'Document deleted');
    }
    catch (error) {
        next(error);
    }
});
// Get single doc
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const doc = await document_model_1.DocumentModel.findById(req.params.id)
            .populate('uploadedBy', 'firstName lastName')
            .populate('reviewedBy', 'firstName lastName');
        if (!doc)
            throw new errors_1.NotFoundError('Document');
        (0, response_1.sendSuccess)(res, doc);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=document.routes.js.map