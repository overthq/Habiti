import { createHash } from 'crypto';

import {
	PrismaClient,
	WebhookEventStatus
} from '../../generated/prisma/client';

/**
 * Delivery-level idempotency for provider webhooks.
 *
 * This is the outer of two layers. The inner one is
 * `LedgerTransaction.idempotencyKey`, which stops a double *posting* even if a
 * delivery somehow gets processed twice.
 */

export const PAYSTACK_WEBHOOK_PROVIDER = 'paystack';

const UNIQUE_VIOLATION = 'P2002';

export const deriveExternalId = (
	rawBody: string,
	eventId?: string | number | null
): string => {
	if (eventId !== undefined && eventId !== null && eventId !== '') {
		return String(eventId);
	}

	return `sha256:${createHash('sha256').update(rawBody).digest('hex')}`;
};

export interface RecordedWebhookEvent {
	id: string;
	duplicate: boolean;
}

interface RecordWebhookEventParams {
	provider: string;
	eventType: string;
	externalId: string;
	payload: unknown;
}

/**
 * Claims a delivery for processing.
 *
 * Returns `duplicate: true` when this event has been seen before.
 */
export const recordWebhookEvent = async (
	prisma: PrismaClient,
	params: RecordWebhookEventParams
): Promise<RecordedWebhookEvent> => {
	try {
		const created = await prisma.webhookEvent.create({
			data: {
				provider: params.provider,
				eventType: params.eventType,
				externalId: params.externalId,
				payload: params.payload as never,
				status: WebhookEventStatus.Received,
				attempts: 1
			},
			select: { id: true }
		});

		return { id: created.id, duplicate: false };
	} catch (error) {
		if ((error as { code?: string } | null)?.code !== UNIQUE_VIOLATION) {
			throw error;
		}

		const existing = await prisma.webhookEvent.findUnique({
			where: {
				provider_externalId: {
					provider: params.provider,
					externalId: params.externalId
				}
			},
			select: { id: true }
		});

		if (!existing) throw error;

		return { id: existing.id, duplicate: true };
	}
};

export const markWebhookEventProcessed = async (
	prisma: PrismaClient,
	id: string,
	status: WebhookEventStatus = WebhookEventStatus.Processed
) =>
	prisma.webhookEvent.update({
		where: { id },
		data: { status, processedAt: new Date(), error: null }
	});

export const markWebhookEventFailed = async (
	prisma: PrismaClient,
	id: string,
	error: unknown
) =>
	prisma.webhookEvent.update({
		where: { id },
		data: {
			status: WebhookEventStatus.Failed,
			// Kept short: this column is for triage, not a stack trace store.
			error: String(
				(error as { message?: string } | null)?.message ?? error
			).slice(0, 1000)
		}
	});

export const getReplayableWebhookEvents = async (
	prisma: PrismaClient,
	provider: string,
	limit = 100
) =>
	prisma.webhookEvent.findMany({
		where: {
			provider,
			status: {
				in: [WebhookEventStatus.Received, WebhookEventStatus.Failed]
			}
		},
		orderBy: { receivedAt: 'asc' },
		take: limit
	});
