import { createHmac } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import * as PaymentLogic from '../core/logic/payments';
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

	let parsed: { event?: string; data?: { id?: string | number } };

	try {
		parsed = JSON.parse(rawBody);
	} catch {
		c.var.logger.error('paystack.webhook.unparseable');
		return c.json({ message: 'Webhook received.' });
	}

	const { event, data } = parsed;

	if (!event) {
		c.var.logger.warn('paystack.webhook.missing_event');
		return c.json({ message: 'Webhook received.' });
	}

	const claim = await PaymentLogic.claimPaystackWebhookEvent(c, {
		rawBody,
		eventType: event,
		externalRef: data?.id,
		payload: parsed
	});

	if (claim.duplicate) {
		c.var.logger.info(
			{ event, externalId: claim.externalId },
			'paystack.webhook.duplicate_ignored'
		);

		return c.json({ message: 'Webhook already processed.' });
	}

	void PaymentLogic.processPaystackWebhookEvent(c, {
		claimId: claim.id,
		event,
		data,
		externalId: claim.externalId
	});

	return c.json({ message: 'Webhook received and processing.' });
});

export default webhooks;
