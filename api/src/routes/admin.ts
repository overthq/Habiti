import { Router } from 'express';

import { login, createAdmin } from '../controllers/admin';

const adminRouter: Router = Router();

adminRouter.post('/login', login);
adminRouter.post('/register', createAdmin);

export default adminRouter;
