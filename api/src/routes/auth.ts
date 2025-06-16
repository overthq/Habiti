import { Router } from 'express';

import { register, login, verify, appleCallback } from '../controllers/auth';
import { validateBody } from '../middleware/validation';
import {
	registerBodySchema,
	authenticateBodySchema
} from '../core/validations/auth';

const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerBodySchema), register);
authRouter.post('/login', validateBody(authenticateBodySchema), login);
authRouter.post('/verify', verify);
authRouter.post('/apple-callback', appleCallback);

export default authRouter;
