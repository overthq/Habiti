import { Router } from 'express';

import AdminController from '../controllers/admin';

const adminRouter: Router = Router();
const adminController = new AdminController();

adminRouter.post('/login', adminController.login);
adminRouter.post('/register', adminController.createAdmin);

export default adminRouter;
