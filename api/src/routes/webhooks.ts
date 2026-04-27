import { createHmac } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { handlePaystackWebhookEvent } from '../core/logic/payments';
import { rateLimit } from '../middleware/rateLimit';
import { timingSafeEqualString } from '../utils/timingSafe';

const webhooks = new Hono<AppEnv>();

webhooks.use('*', rateLimit({ prefix: 'webhooks', windowSec: 60, limit: 60 }));

webhooks.post('/paystack', async c => {
	const rawBody = await c.req.text();
	const expected = createHmac('sha512', env.PAYSTACK_SECRET_KEY)
		.update(rawBody)
		.digest('hex');
	const provided = c.req.header('x-paystack-signature') ?? '';

	if (!timingSafeEqualString(expected, provided)) {
		return c.json({ message: 'Invalid signature' }, 400);
	}

	const { event, data } = JSON.parse(rawBody);

	Promise.resolve().then(async () => {
		handlePaystackWebhookEvent(c, event, data);
	});

	return c.json({ message: 'Webhook received and processing.' });
});

export default webhooks;
