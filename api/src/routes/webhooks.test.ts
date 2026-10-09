import { describe, expect, test, mock } from 'bun:test';
import { createHmac } from 'crypto';

import { env } from '../config/env';
import { createFakePrisma, createTestApp } from '../test/helpers';
import { WebhookEventStatus } from '../generated/prisma/client';

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
		update: mock(async ({ where, data: { attempts, ...data } }: any) => {
			const key = where.provider_externalId;
			const found = rows.find(r =>
				key
					? r.provider === key.provider && r.externalId === key.externalId
					: r.id === where.id
			);

			Object.assign(found, data);
			if (attempts) found.attempts += attempts.increment;

			return found;
		})
	};

	const models: Record<string, unknown> = { webhookEvent };

	return { prisma: createFakePrisma(models), models, webhookEvent, rows };
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

// Processing happens after the response; let it finish.
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

	test('processes a redelivery of an event that failed the first time', async () => {
		const { prisma, models, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		await post(app, failingEvent(999));
		await settle();

		// The models whose absence made the first attempt fail.
		models.user = { findUnique: mock(async () => ({ id: 'user-1' })) };
		models.card = { upsert: mock(async () => ({})) };

		const retry = await post(app, failingEvent(999));
		await settle();

		expect(retry.status).toBe(200);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			attempts: 2,
			status: WebhookEventStatus.Processed
		});
	});

	test('ignores a redelivery of the same event', async () => {
		const { prisma, rows } = webhookPrisma();
		const { app } = createTestApp({ prisma });

		const payload = event(37272792);

		const first = await post(app, payload);
		await settle();
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
