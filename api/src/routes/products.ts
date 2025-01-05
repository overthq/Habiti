import { Router } from 'express';

import ProductController from '../controllers/products';
import { authenticate, optionalAuth } from '../middleware/auth';

const router: Router = Router();
const productController = new ProductController();

router.get('/:id', optionalAuth, productController.getProductById);
router.get('/:id/reviews', optionalAuth, productController.getProductReviews);

router.post(
	'/:id/reviews',
	authenticate,
	productController.createProductReview
);
router.get('/:id/related', optionalAuth, productController.getRelatedProducts);

export default router;
