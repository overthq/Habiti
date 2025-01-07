import { Router } from 'express';

import OrderController from '../controllers/orders';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = Router();
const orderController = new OrderController();

router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);

router.get('/', isAdmin, orderController.getOrders);

export default router;
