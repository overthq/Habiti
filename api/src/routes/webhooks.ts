import { createHmac, timingSafeEqual } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { handlePaystackWebhookEvent } from '../core/logic/payments';
import { rateLimit } from '../middleware/rateLimit';

const webhooks = new Hono<AppEnv>();

webhooks.use('*', rateLimit({ prefix: 'webhooks', windowSec: 60, limit: 60 }));

webhooks.post('/paystack', async c => {
	const rawBody = await c.req.text();
	const expected = Buffer.from(
		createHmac('sha512', env.PAYSTACK_SECRET_KEY).update(rawBody).digest('hex'),
		'utf8'
	);
	const provided = Buffer.from(
		c.req.header('x-paystack-signature') ?? '',
		'utf8'
	);

	const valid =
		expected.length === provided.length &&
		expected.length > 0 &&
		timingSafeEqual(expected, provided);

	if (!valid) {
		return c.json({ message: 'Invalid signature' }, 400);
	}

	const { event, data } = JSON.parse(rawBody);

	Promise.resolve().then(async () => {
		handlePaystackWebhookEvent(c, event, data);
	});

	return c.json({ message: 'Webhook received and processing.' });
});

export default webhooks;
