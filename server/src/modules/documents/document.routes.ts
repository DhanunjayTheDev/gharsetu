import { Router, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { UserRole, DocumentStatus } from '../../shared/types';
import { DocumentModel } from './document.model';
import { upload } from '../../shared/middleware/upload';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

// Upload document
router.post(
  '/',
  authenticate,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const file = req.file!;
      let fileUrl = `/uploads/${file.filename}`;
      let cloudinaryId: string | undefined;

      // Try cloudinary upload
      try {
        const result = await uploadToCloudinary(file.path, 'documents');
        fileUrl = result.url;
        cloudinaryId = result.publicId;
      } catch {
        // Fallback to local storage
      }

      const doc = await DocumentModel.create({
        title: req.body.title || file.originalname,
        description: req.body.description,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        cloudinaryId,
        uploadedBy: req.user!.userId,
        relatedEntity: {
          entityType: req.body.entityType,
          entityId: req.body.entityId,
        },
      });

      sendSuccess(res, doc, 'Document uploaded', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get documents for an entity
router.get('/entity/:entityType/:entityId', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req);
      const filter = {
        'relatedEntity.entityType': req.params.entityType,
        'relatedEntity.entityId': req.params.entityId,
      };

      const [docs, total] = await Promise.all([
        DocumentModel.find(filter)
          .populate('uploadedBy', 'firstName lastName')
          .populate('reviewedBy', 'firstName lastName')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        DocumentModel.countDocuments(filter),
      ]);
      sendPaginated(res, docs, total, page, limit);
    } catch (error) { next(error); }
  }
);

// Review document (admin/legal)
router.patch('/:id/review', authenticate, authorize(UserRole.ADMIN, UserRole.LEGAL_ADVISOR),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const update: Record<string, any> = {
        status: req.body.status,
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      };
      if (req.body.status === DocumentStatus.REJECTED) {
        update.rejectionReason = req.body.rejectionReason;
      }

      const doc = await DocumentModel.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!doc) throw new NotFoundError('Document');
      sendSuccess(res, doc, 'Document reviewed');
    } catch (error) { next(error); }
  }
);

// Delete document
router.delete('/:id', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const doc = await DocumentModel.findOne({ _id: req.params.id, uploadedBy: req.user!.userId });
      if (!doc) throw new NotFoundError('Document');

      if (doc.cloudinaryId) {
        await deleteFromCloudinary(doc.cloudinaryId);
      }
      await doc.deleteOne();
      sendSuccess(res, null, 'Document deleted');
    } catch (error) { next(error); }
  }
);

// Get single doc
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await DocumentModel.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName')
      .populate('reviewedBy', 'firstName lastName');
    if (!doc) throw new NotFoundError('Document');
    sendSuccess(res, doc);
  } catch (error) { next(error); }
});

export default router;
