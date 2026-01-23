import { User } from '../generated/prisma/client';

declare global {
	namespace Express {
		interface Request {
			auth?: {
				id: string;
				name: string;
				email: string;
				role: 'admin' | 'user';
			};
		}
	}
}
