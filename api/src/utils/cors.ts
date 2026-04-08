import { cors } from 'hono/cors';
import { env } from '../config/env';

export const ALLOWED_ORIGINS =
	env.NODE_ENV === 'production'
		? ['https://habiti.app', 'https://admin.habiti.app']
		: ['http://localhost:3000', 'http://localhost:5173'];

export const corsConfig = cors({
	origin: origin => {
		if (ALLOWED_ORIGINS.includes(origin)) return origin;
		return '';
	},
	credentials: true
});
