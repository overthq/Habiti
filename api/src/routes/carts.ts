import { Router } from 'express';

import CartController from '../controllers/carts';
import { authenticate } from '../middleware/auth';

const router: Router = Router();
const cartController = new CartController();

router.get('/:id', authenticate, cartController.getCartById);

export default router;
