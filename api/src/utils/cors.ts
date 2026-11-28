import { cors } from 'hono/cors';
import { env } from '../config/env';

export const ALLOWED_ORIGINS = [
	'https://habiti.app',
	'https://admin.habiti.app'
];

const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

export const isAllowedOrigin = (origin: string) =>
	env.NODE_ENV === 'production'
		? ALLOWED_ORIGINS.includes(origin)
		: LOCAL_ORIGIN.test(origin);

export const corsConfig = cors({
	origin: origin => (isAllowedOrigin(origin) ? origin : ''),
	credentials: true
});
