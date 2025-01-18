import { Router } from 'express';

import AuthController from '../controllers/auth';

const authRouter: Router = Router();
const authController = new AuthController();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/verify', authController.verify);
authRouter.post('/apple-callback', authController.appleCallback);

export default authRouter;
