import { Router } from 'express';

import {
	getCartById,
	addProductToCart,
	removeProductFromCart
} from '../controllers/carts';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

router.get('/:id', authenticate, getCartById);
router.post('/products', authenticate, addProductToCart);
router.delete('/:id/products/:productId', authenticate, removeProductFromCart);

export default router;
