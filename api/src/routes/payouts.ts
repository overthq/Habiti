import { Router } from 'express';

import { getPayouts, getPayout, updatePayout } from '../controllers/payouts';
import { isAdmin } from '../middleware/auth';

const payoutsRouter: Router = Router();

payoutsRouter.get('/', isAdmin, getPayouts);
payoutsRouter.get('/:id', isAdmin, getPayout);
payoutsRouter.patch('/:id', isAdmin, updatePayout);

export default payoutsRouter;
