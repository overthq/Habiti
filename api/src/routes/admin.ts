import { Router } from 'express';

import {
	login,
	// createAdmin,
	getOverview,
	getPayouts,
	getPayout,
	updatePayout
} from '../controllers/admin';

const adminRouter: Router = Router();

adminRouter.post('/login', login);
// adminRouter.post('/register', createAdmin);
adminRouter.get('/overview', getOverview);
adminRouter.get('/payouts', getPayouts);
adminRouter.get('/payouts/:id', getPayout);
adminRouter.patch('/payouts/:id', updatePayout);

export default adminRouter;
