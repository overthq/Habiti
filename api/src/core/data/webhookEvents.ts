import { createHash } from 'crypto';

import {
	PrismaClient,
	WebhookEventStatus
} from '../../generated/prisma/client';

/**
 * Delivery-level idempotency for provider webhooks.
 *
 * Providers retry. Before this existed, a retried `charge.success` was safe
 * only because downstream status guards happened to be conditional -- there
 * was no record of what had already been seen, and a handler that crashed
 * halfway left nothing to replay.
 *
 * This is the outer of two layers. The inner one is
 * `LedgerTransaction.idempotencyKey`, which stops a double *posting* even if a
 * delivery somehow gets processed twice.
 */

/**
 * The `provider` value Paystack deliveries are stored under.
 *
 * Shared by the route that claims a delivery and the script that replays one:
 * these two read and write the same column, and a disagreement between them
 * does not fail loudly -- replay simply matches nothing and stuck deliveries
 * sit there forever. Matches `PAYSTACK_PROVIDER` in `data/payoutAccounts.ts`,
 * which names the same vendor on its own table.
 */
export const PAYSTACK_WEBHOOK_PROVIDER = 'paystack';

const UNIQUE_VIOLATION = 'P2002';

/**
 * The identifier a delivery is deduplicated on.
 *
 * Paystack's own event id is preferred. When it is absent we hash the raw
 * body: two identical bodies are a retry for our purposes, and hashing is far
 * safer than falling back to `reference`, which is shared by genuinely
 * distinct events for the same transfer.
 */
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
 * Returns `duplicate: true` when this event has been seen before, in which
 * case the caller must not process it. The claim is a plain insert, so the
 * unique index is what arbitrates between two concurrent deliveries of the
 * same event -- not a read-then-write that could interleave.
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

/**
 * Deliveries that were claimed but never completed -- a crash mid-processing,
 * or a handler that threw. The replay path reads this.
 */
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
