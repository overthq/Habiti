import { Router } from 'express';

import {
	getProductById,
	getProductReviews,
	createProductReview,
	getRelatedProducts,
	getProducts,
	updateProduct
} from '../controllers/products';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth';

const router: Router = Router();

router.get('/:id', optionalAuth, getProductById);
router.put('/:id', isAdmin, updateProduct);
router.get('/:id/reviews', optionalAuth, getProductReviews);

router.post('/:id/reviews', authenticate, createProductReview);
router.get('/:id/related', optionalAuth, getRelatedProducts);

router.get('/', isAdmin, getProducts);

export default router;
