import { Router } from 'express';

import { login, createAdmin, getOverview } from '../controllers/admin';

const adminRouter: Router = Router();

adminRouter.post('/login', login);
adminRouter.post('/register', createAdmin);
adminRouter.get('/overview', getOverview);

export default adminRouter;
