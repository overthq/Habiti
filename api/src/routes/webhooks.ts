import { createHmac } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { handlePaystackWebhookEvent } from '../core/logic/payments';

const webhooks = new Hono<AppEnv>();

webhooks.post('/paystack', async c => {
	const rawBody = await c.req.text();
	const hash = createHmac('sha512', env.PAYSTACK_SECRET_KEY)
		.update(rawBody)
		.digest('hex');

	if (hash === c.req.header('x-paystack-signature')) {
		const { event, data } = JSON.parse(rawBody);

		Promise.resolve().then(async () => {
			handlePaystackWebhookEvent(c, event, data);
		});

		return c.json({
			success: true,
			data: { message: 'Webhook received and processing.' }
		});
	} else {
		return c.json(
			{
				success: false,
				data: {
					message: 'This message did not originate from Paystack'
				}
			},
			400
		);
	}
});

export default webhooks;
