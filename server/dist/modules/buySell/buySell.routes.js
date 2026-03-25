"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const offer_model_1 = require("./offer.model");
const property_model_1 = require("../properties/property.model");
const response_1 = require("../../shared/utils/response");
const pagination_1 = require("../../shared/utils/pagination");
const errors_1 = require("../../shared/utils/errors");
const router = (0, express_1.Router)();
const createOfferSchema = zod_1.z.object({
    property: zod_1.z.string().min(1),
    offerPrice: zod_1.z.number().positive(),
    message: zod_1.z.string().min(5).max(500),
});
// Submit offer
router.post('/', auth_1.authenticate, (0, validate_1.validate)(createOfferSchema), async (req, res, next) => {
    try {
        const property = await property_model_1.Property.findById(req.body.property);
        if (!property)
            throw new errors_1.NotFoundError('Property');
        const offer = await offer_model_1.Offer.create({
            property: req.body.property,
            buyer: req.user.userId,
            seller: property.owner,
            offerPrice: req.body.offerPrice,
            negotiationThread: [{
                    from: req.user.userId,
                    message: req.body.message,
                    price: req.body.offerPrice,
                    createdAt: new Date(),
                }],
        });
        (0, response_1.sendSuccess)(res, offer, 'Offer submitted', 201);
    }
    catch (error) {
        next(error);
    }
});
// Get my offers (as buyer)
router.get('/my', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const [offers, total] = await Promise.all([
            offer_model_1.Offer.find({ buyer: req.user.userId })
                .populate('property', 'title images location price')
                .populate('seller', 'firstName lastName')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            offer_model_1.Offer.countDocuments({ buyer: req.user.userId }),
        ]);
        (0, response_1.sendPaginated)(res, offers, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get received offers (as seller)
router.get('/received', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
        const [offers, total] = await Promise.all([
            offer_model_1.Offer.find({ seller: req.user.userId })
                .populate('property', 'title images location price')
                .populate('buyer', 'firstName lastName email phone')
                .skip(skip).limit(limit).sort({ createdAt: -1 }),
            offer_model_1.Offer.countDocuments({ seller: req.user.userId }),
        ]);
        (0, response_1.sendPaginated)(res, offers, total, page, limit);
    }
    catch (error) {
        next(error);
    }
});
// Get single offer
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const offer = await offer_model_1.Offer.findById(req.params.id)
            .populate('property')
            .populate('buyer', 'firstName lastName email phone')
            .populate('seller', 'firstName lastName email phone')
            .populate('negotiationThread.from', 'firstName lastName');
        if (!offer)
            throw new errors_1.NotFoundError('Offer');
        const userId = req.user.userId;
        if (offer.buyer.toString() !== userId && offer.seller.toString() !== userId) {
            throw new errors_1.ForbiddenError();
        }
        (0, response_1.sendSuccess)(res, offer);
    }
    catch (error) {
        next(error);
    }
});
// Counter / Accept / Reject offer
router.patch('/:id/respond', auth_1.authenticate, async (req, res, next) => {
    try {
        const offer = await offer_model_1.Offer.findById(req.params.id);
        if (!offer)
            throw new errors_1.NotFoundError('Offer');
        if (offer.seller.toString() !== req.user.userId)
            throw new errors_1.ForbiddenError();
        const { action, message, counterPrice } = req.body;
        if (action === 'accept') {
            offer.status = 'accepted';
        }
        else if (action === 'reject') {
            offer.status = 'rejected';
        }
        else if (action === 'counter' && counterPrice) {
            offer.status = 'countered';
            offer.counterPrice = counterPrice;
        }
        if (message) {
            offer.negotiationThread.push({
                from: req.user.userId,
                message,
                price: counterPrice,
                createdAt: new Date(),
            });
        }
        await offer.save();
        (0, response_1.sendSuccess)(res, offer, `Offer ${action}ed`);
    }
    catch (error) {
        next(error);
    }
});
// Buyer responds to counter
router.patch('/:id/negotiate', auth_1.authenticate, async (req, res, next) => {
    try {
        const offer = await offer_model_1.Offer.findById(req.params.id);
        if (!offer)
            throw new errors_1.NotFoundError('Offer');
        if (offer.buyer.toString() !== req.user.userId)
            throw new errors_1.ForbiddenError();
        const { action, message, newPrice } = req.body;
        if (action === 'accept') {
            offer.status = 'accepted';
            offer.offerPrice = offer.counterPrice || offer.offerPrice;
        }
        else if (action === 'withdraw') {
            offer.status = 'withdrawn';
        }
        else if (action === 'counter' && newPrice) {
            offer.status = 'pending';
            offer.offerPrice = newPrice;
        }
        if (message) {
            offer.negotiationThread.push({
                from: req.user.userId,
                message,
                price: newPrice,
                createdAt: new Date(),
            });
        }
        await offer.save();
        (0, response_1.sendSuccess)(res, offer, 'Negotiation updated');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=buySell.routes.js.map