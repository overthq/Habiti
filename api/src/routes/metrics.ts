import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { metrics } from '../services/metrics';
import { timingSafeEqualString } from '../utils/timingSafe';

const route = new Hono<AppEnv>();

route.get('/metrics', c => {
	if (!env.INTERNAL_TOKEN) {
		throw new HTTPException(404, { message: 'Not found' });
	}

	const provided = c.req.header('x-internal-token');

	if (!provided || !timingSafeEqualString(env.INTERNAL_TOKEN, provided)) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	return c.text(metrics.snapshotPrometheus(), 200, {
		'Content-Type': 'text/plain; version=0.0.4'
	});
});

export default route;
