import { Router } from 'express';

import { register, login, verify, appleCallback } from '../controllers/auth';

const authRouter: Router = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verify', verify);
authRouter.post('/apple-callback', appleCallback);

export default authRouter;
