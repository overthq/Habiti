import { createHmac } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { handlePaystackWebhookEvent } from '../core/logic/payments';
import {
	deriveExternalId,
	markWebhookEventFailed,
	markWebhookEventProcessed,
	PAYSTACK_WEBHOOK_PROVIDER,
	recordWebhookEvent
} from '../core/data/webhookEvents';
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

	const externalId = deriveExternalId(rawBody, data?.id);

	// Claim the delivery before doing any work. Two things fall out of the
	// ordering: a retry is recognised without reprocessing, and a crash
	// mid-handler leaves a `Received` row that can be replayed rather than an
	// event that vanished.
	const claim = await recordWebhookEvent(c.var.prisma, {
		provider: PAYSTACK_WEBHOOK_PROVIDER,
		eventType: event,
		externalId,
		payload: parsed
	});

	if (claim.duplicate) {
		c.var.logger.info(
			{ event, externalId },
			'paystack.webhook.duplicate_ignored'
		);

		return c.json({ message: 'Webhook already processed.' });
	}

	void (async () => {
		try {
			await handlePaystackWebhookEvent(c, event, data, claim.id);
			await markWebhookEventProcessed(c.var.prisma, claim.id);
		} catch (error) {
			c.var.logger.error(
				{ err: error, event, externalId },
				'paystack.webhook.processing_failed'
			);

			try {
				await markWebhookEventFailed(c.var.prisma, claim.id, error);
			} catch (markError) {
				c.var.logger.error(
					{ err: markError, event, externalId },
					'paystack.webhook.mark_failed_errored'
				);
			}
		}
	})();

	return c.json({ message: 'Webhook received and processing.' });
});

export default webhooks;
