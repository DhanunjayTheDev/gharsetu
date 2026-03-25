import { Router } from 'express';
import { authenticate, authorize, optionalAuth, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { upload } from '../../shared/middleware/upload';
import { UserRole, PropertyStatus } from '../../shared/types';
import { propertyService } from './property.service';
import { createPropertySchema, updatePropertySchema, propertyQuerySchema } from './property.validation';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { uploadToCloudinary } from '../../config/cloudinary';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Public routes
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = parsePagination(req);
    const filters = {
      type: req.query.type as string,
      purpose: req.query.purpose as string,
      city: req.query.city as string,
      state: req.query.state as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
      search: req.query.search as string,
      lat: req.query.lat ? Number(req.query.lat) : undefined,
      lng: req.query.lng ? Number(req.query.lng) : undefined,
      radius: req.query.radius ? Number(req.query.radius) : undefined,
    };
    const { properties, total } = await propertyService.findAll(filters, page, limit);
    sendPaginated(res, properties, total, page, limit);
  } catch (error) {
    next(error);
  }
});

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await propertyService.getFeatured();
    sendSuccess(res, properties);
  } catch (error) {
    next(error);
  }
});

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius, limit } = req.query;
    const properties = await propertyService.getNearby(
      Number(lat), Number(lng), Number(radius) || 10, Number(limit) || 10
    );
    sendSuccess(res, properties);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertyService.findById(req.params.id);
    sendSuccess(res, property);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post(
  '/',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.ADMIN),
  validate(createPropertySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const property = await propertyService.create(req.user!.userId, req.body);
      sendSuccess(res, property, 'Property created', 201);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.ADMIN),
  validate(updatePropertySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const property = await propertyService.update(req.params.id, req.user!.userId, req.user!.role, req.body);
      sendSuccess(res, property, 'Property updated');
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.ADMIN),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await propertyService.delete(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, null, 'Property deactivated');
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/my/listings',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.BUILDER),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req);
      const { properties, total } = await propertyService.getMyProperties(req.user!.userId, page, limit);
      sendPaginated(res, properties, total, page, limit);
    } catch (error) {
      next(error);
    }
  }
);

// Image upload
router.post(
  '/:id/images',
  authenticate,
  authorize(UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.ADMIN),
  upload.array('images', 10),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file.path, 'properties');
        uploadedUrls.push(result.url);
      }
      const property = await propertyService.update(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        { images: uploadedUrls } as any
      );
      sendSuccess(res, property, 'Images uploaded');
    } catch (error) {
      next(error);
    }
  }
);

// Admin: update status
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await propertyService.updateStatus(req.params.id, req.body.status as PropertyStatus);
      sendSuccess(res, property, 'Status updated');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
