import { Router } from 'express';

import { login, getOverview } from '../controllers/admin';

const adminRouter: Router = Router();

adminRouter.post('/login', login);
adminRouter.get('/overview', getOverview);

export default adminRouter;
