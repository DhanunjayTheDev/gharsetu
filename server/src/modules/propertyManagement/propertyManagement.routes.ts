import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { UserRole, GlobalStatus } from '../../shared/types';
import { PropertyManagement } from './propertyManagement.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError } from '../../shared/utils/errors';

const router = Router();

const createPMSchema = z.object({
  property: z.string().min(1),
  manager: z.string().min(1),
  monthlyFee: z.number().positive(),
  services: z.array(z.enum(['rent_collection', 'maintenance', 'tenant_screening', 'inspections'])),
  contractStart: z.string().datetime(),
  contractEnd: z.string().datetime(),
});

// Create management contract
router.post('/', authenticate, authorize(UserRole.PROPERTY_OWNER, UserRole.ADMIN), validate(createPMSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const contract = await PropertyManagement.create({ ...req.body, owner: req.user!.userId });
      sendSuccess(res, contract, 'Management contract created', 201);
    } catch (error) { next(error); }
  }
);

// Get my contracts
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const userId = req.user!.userId;
    const filter = { $or: [{ owner: userId }, { manager: userId }] };
    const [contracts, total] = await Promise.all([
      PropertyManagement.find(filter)
        .populate('property', 'title images location')
        .populate('owner', 'firstName lastName')
        .populate('manager', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      PropertyManagement.countDocuments(filter),
    ]);
    sendPaginated(res, contracts, total, page, limit);
  } catch (error) { next(error); }
});

// Get single contract
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const contract = await PropertyManagement.findById(req.params.id)
      .populate('property').populate('owner', 'firstName lastName email phone')
      .populate('manager', 'firstName lastName email phone');
    if (!contract) throw new NotFoundError('Contract');
    sendSuccess(res, contract);
  } catch (error) { next(error); }
});

// Add maintenance request
router.post('/:id/maintenance', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const contract = await PropertyManagement.findById(req.params.id);
    if (!contract) throw new NotFoundError('Contract');
    contract.maintenanceRequests.push({ ...req.body, createdAt: new Date() });
    await contract.save();
    sendSuccess(res, contract, 'Maintenance request added');
  } catch (error) { next(error); }
});

// Update maintenance status
router.patch('/:id/maintenance/:maintenanceId', authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const contract = await PropertyManagement.findById(req.params.id);
      if (!contract) throw new NotFoundError('Contract');
      const maintenance = contract.maintenanceRequests.find((m: any) => m._id?.toString() === req.params.maintenanceId);
      if (!maintenance) throw new NotFoundError('Maintenance request');
      Object.assign(maintenance, req.body);
      if (req.body.status === GlobalStatus.COMPLETED) maintenance.resolvedAt = new Date();
      await contract.save();
      sendSuccess(res, contract, 'Maintenance updated');
    } catch (error) { next(error); }
  }
);

// Record rent collection
router.post('/:id/rent', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const contract = await PropertyManagement.findById(req.params.id);
    if (!contract) throw new NotFoundError('Contract');
    contract.rentTracking.push({ ...req.body, collected: true, collectedAt: new Date() });
    await contract.save();
    sendSuccess(res, contract, 'Rent recorded');
  } catch (error) { next(error); }
});

export default router;
