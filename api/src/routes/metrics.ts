import { timingSafeEqual } from 'crypto';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { metrics } from '../services/metrics';

const route = new Hono<AppEnv>();

const checkInternalToken = (provided: string | undefined): boolean => {
	if (!env.INTERNAL_TOKEN || !provided) return false;
	const a = Buffer.from(env.INTERNAL_TOKEN, 'utf8');
	const b = Buffer.from(provided, 'utf8');
	return a.length === b.length && timingSafeEqual(a, b);
};

route.get('/metrics', c => {
	if (!env.INTERNAL_TOKEN) {
		// Fail closed — refuse to serve metrics until an internal token is set.
		throw new HTTPException(404, { message: 'Not found' });
	}

	const provided = c.req.header('x-internal-token');
	if (!checkInternalToken(provided)) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	return c.text(metrics.snapshotPrometheus(), 200, {
		'Content-Type': 'text/plain; version=0.0.4'
	});
});

export default route;
