import { Router } from 'express';

import { getOrderById, createOrder, getOrders } from '../controllers/orders';
import { authenticate, isAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createOrderSchema } from '../core/validations/orders';

const router: Router = Router();

router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, validateBody(createOrderSchema), createOrder);

router.get('/', isAdmin, getOrders);

export default router;
