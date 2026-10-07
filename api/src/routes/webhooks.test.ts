import { describe, expect, test, mock } from 'bun:test';
import { createHmac } from 'crypto';

import { env } from '../config/env';
import { createFakePrisma, createTestApp } from '../test/helpers';
import { WebhookEventStatus } from '../generated/prisma/client';

/**
 * Paystack retries deliveries, and the old handler had no record of what it
 * had already seen -- a replayed `charge.success` was safe only because the
 * downstream status guard happened to be conditional.
 *
 * These tests cover the outer of the two idempotency layers: the claim on
 * `WebhookEvent`. The inner layer (`LedgerTransaction.idempotencyKey`) is
 * covered in the ledger tests.
 */

const sign = (body: string) =>
	createHmac('sha512', env.PAYSTACK_SECRET_KEY).update(body).digest('hex');

const UNIQUE_VIOLATION = Object.assign(new Error('unique'), { code: 'P2002' });

const webhookPrisma = () => {
	const rows: any[] = [];

	const webhookEvent = {
		create: mock(async ({ data }: any) => {
			const clash = rows.find(
				r => r.provider === data.provider && r.externalId === data.externalId
			);

			if (clash) throw UNIQUE_VIOLATION;

			const row = { id: `evt-${rows.length + 1}`, ...data };
			rows.push(row);
			return { id: row.id };
		}),
		findUnique: mock(async ({ where }: any) => {
			const { provider, externalId } = where.provider_externalId;
			const found = rows.find(
				r => r.provider === provider && r.externalId === externalId
			);
			return found ? { id: found.id } : null;
		}),
		update: mock(async ({ where, data }: any) => {
			const found = rows.find(r => r.id === where.id);
			if (found) Object.assign(found, data);
			return found;
		})
	};

	return { prisma: createFakePrisma({ webhookEvent }), webhookEvent, rows };
};

const post = (app: any, body: unknown, signature?: string) => {
	const raw = JSON.stringify(body);

	return app.request('/webhooks/paystack', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-paystack-signature': signature ?? sign(raw)
		},
		body: raw
	});
};

/** Processing is fire-and-forget so the ack is fast; let it settle. */
const settle = () => new Promise(resolve => setTimeout(resolve, 10));

// A transfer charge with no order metadata: the handler recognises it and
// returns early, so the delivery completes without touching another model.
const event = (id: number | undefined, type = 'charge.success') => ({
	event: type,
	data: {
		...(id === undefined ? {} : { id }),
		customer: { email: 'ada@example.com' },
		authorization: { card_type: 'transfer' },
		metadata: null
	}
});

// A card charge, which the handler tries to store -- and which fails here,
// because the fake Prisma has no `card` model.
const failingEvent = (id: number) => ({
	event: 'charge.success',
	data: {
		id,
		customer: { email: 'ada@example.com' },
		authorization: { card_type: 'visa' },
		metadata: null
	}
});

describe('POST /webhooks/paystack', () => {
	test('rejects a body whose signature does not verify', async () => {
		const { prisma, webhookEvent } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const response = await post(app, event(1), 'not-a-real-signature');

		expect(response.status).toBe(400);
		// Nothing is claimed before the signature is verified.
		expect(webhookEvent.create).not.toHaveBeenCalled();
	});

	test('claims a delivery before processing it', async () => {
		const { prisma, webhookEvent, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const response = await post(app, event(37272792));
		await settle();

		expect(response.status).toBe(200);
		expect(webhookEvent.create).toHaveBeenCalledTimes(1);
		expect(rows[0]).toMatchObject({
			provider: 'paystack',
			eventType: 'charge.success',
			externalId: '37272792',
			status: WebhookEventStatus.Processed
		});
	});

	/**
	 * The old handler swallowed errors, so a charge that failed to process was
	 * indistinguishable from one that never arrived. Now it leaves a row.
	 */
	test('records a delivery whose handler throws as Failed', async () => {
		const { prisma, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const response = await post(app, failingEvent(999));
		await settle();

		expect(response.status).toBe(200);
		expect(rows[0]).toMatchObject({
			externalId: '999',
			status: WebhookEventStatus.Failed
		});
		expect(rows[0].error).toBeTruthy();
	});

	test('ignores a redelivery of the same event', async () => {
		const { prisma, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const payload = event(37272792);

		const first = await post(app, payload);
		const second = await post(app, payload);
		const third = await post(app, payload);

		expect(first.status).toBe(200);
		expect(await second.json()).toEqual({
			message: 'Webhook already processed.'
		});
		expect(await third.json()).toEqual({
			message: 'Webhook already processed.'
		});
		expect(rows).toHaveLength(1);
	});

	test('distinct events are processed independently', async () => {
		const { prisma, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		await post(app, event(1));
		await post(app, event(2));

		expect(rows).toHaveLength(2);
	});

	/**
	 * Paystack has changed payload shapes without warning before. A delivery
	 * with no `id` still has to deduplicate, so it falls back to hashing the
	 * body rather than being dropped or processed twice.
	 */
	test('falls back to hashing the body when the event carries no id', async () => {
		const { prisma, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		await post(app, event(undefined));
		await post(app, event(undefined));

		expect(rows).toHaveLength(1);
		expect(rows[0].externalId).toStartWith('sha256:');
	});

	test('accepts an unparseable body rather than inviting endless retries', async () => {
		const { prisma, webhookEvent } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const raw = 'not json';
		const response = await app.request('/webhooks/paystack', {
			method: 'POST',
			headers: { 'x-paystack-signature': sign(raw) },
			body: raw
		});

		expect(response.status).toBe(200);
		expect(webhookEvent.create).not.toHaveBeenCalled();
	});
});
