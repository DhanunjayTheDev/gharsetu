import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { Offer } from './offer.model';
import { Property } from '../properties/property.model';
import { sendSuccess, sendPaginated } from '../../shared/utils/response';
import { parsePagination } from '../../shared/utils/pagination';
import { NotFoundError, ForbiddenError } from '../../shared/utils/errors';

const router = Router();

const createOfferSchema = z.object({
  property: z.string().min(1),
  offerPrice: z.number().positive(),
  message: z.string().min(5).max(500),
});

// Submit offer
router.post(
  '/',
  authenticate,
  validate(createOfferSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const property = await Property.findById(req.body.property);
      if (!property) throw new NotFoundError('Property');

      const offer = await Offer.create({
        property: req.body.property,
        buyer: req.user!.userId,
        seller: property.owner,
        offerPrice: req.body.offerPrice,
        negotiationThread: [{
          from: req.user!.userId,
          message: req.body.message,
          price: req.body.offerPrice,
          createdAt: new Date(),
        }],
      });

      sendSuccess(res, offer, 'Offer submitted', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get my offers (as buyer)
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const [offers, total] = await Promise.all([
      Offer.find({ buyer: req.user!.userId })
        .populate('property', 'title images location price')
        .populate('seller', 'firstName lastName')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Offer.countDocuments({ buyer: req.user!.userId }),
    ]);
    sendPaginated(res, offers, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Get received offers (as seller)
router.get('/received', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const [offers, total] = await Promise.all([
      Offer.find({ seller: req.user!.userId })
        .populate('property', 'title images location price')
        .populate('buyer', 'firstName lastName email phone')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Offer.countDocuments({ seller: req.user!.userId }),
    ]);
    sendPaginated(res, offers, total, page, limit);
  } catch (error) {
    next(error);
  }
});

// Get single offer
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('property')
      .populate('buyer', 'firstName lastName email phone')
      .populate('seller', 'firstName lastName email phone')
      .populate('negotiationThread.from', 'firstName lastName');
    if (!offer) throw new NotFoundError('Offer');

    const userId = req.user!.userId;
    if (offer.buyer.toString() !== userId && offer.seller.toString() !== userId) {
      throw new ForbiddenError();
    }
    sendSuccess(res, offer);
  } catch (error) {
    next(error);
  }
});

// Counter / Accept / Reject offer
router.patch('/:id/respond', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) throw new NotFoundError('Offer');
    if (offer.seller.toString() !== req.user!.userId) throw new ForbiddenError();

    const { action, message, counterPrice } = req.body;

    if (action === 'accept') {
      offer.status = 'accepted';
    } else if (action === 'reject') {
      offer.status = 'rejected';
    } else if (action === 'counter' && counterPrice) {
      offer.status = 'countered';
      offer.counterPrice = counterPrice;
    }

    if (message) {
      offer.negotiationThread.push({
        from: req.user!.userId as any,
        message,
        price: counterPrice,
        createdAt: new Date(),
      });
    }

    await offer.save();
    sendSuccess(res, offer, `Offer ${action}ed`);
  } catch (error) {
    next(error);
  }
});

// Buyer responds to counter
router.patch('/:id/negotiate', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) throw new NotFoundError('Offer');
    if (offer.buyer.toString() !== req.user!.userId) throw new ForbiddenError();

    const { action, message, newPrice } = req.body;

    if (action === 'accept') {
      offer.status = 'accepted';
      offer.offerPrice = offer.counterPrice || offer.offerPrice;
    } else if (action === 'withdraw') {
      offer.status = 'withdrawn';
    } else if (action === 'counter' && newPrice) {
      offer.status = 'pending';
      offer.offerPrice = newPrice;
    }

    if (message) {
      offer.negotiationThread.push({
        from: req.user!.userId as any,
        message,
        price: newPrice,
        createdAt: new Date(),
      });
    }

    await offer.save();
    sendSuccess(res, offer, 'Negotiation updated');
  } catch (error) {
    next(error);
  }
});

export default router;
