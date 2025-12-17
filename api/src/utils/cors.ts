import cors from 'cors';
import { env } from '../config/env';

export const ALLOWED_ORIGINS =
	env.NODE_ENV === 'production'
		? ['https://habiti.app', 'https://admin.habiti.app']
		: ['http://localhost:3000', 'http://localhost:5173'];

export const corsConfig = cors({
	origin: (origin, callback) => {
		if ((origin && ALLOWED_ORIGINS.includes(origin)) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	preflightContinue: false,
	credentials: true
});
