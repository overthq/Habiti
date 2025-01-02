import { Router } from 'express';

import OrderController from '../controllers/orders';
import { authenticate } from '../middleware/auth';

const router: Router = Router();
const orderController = new OrderController();

router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);

export default router;
