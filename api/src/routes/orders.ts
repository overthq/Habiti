import { Router } from 'express';

import { getOrderById, createOrder, getOrders } from '../controllers/orders';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = Router();

router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);

router.get('/', isAdmin, getOrders);

export default router;
