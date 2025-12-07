import { User } from '../generated/prisma/client';

declare global {
	namespace Express {
		interface Request {
			auth?: User;
		}
	}
}
