import { createHash } from 'crypto';

import {
	PrismaClient,
	WebhookEventStatus
} from '../../generated/prisma/client';

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

interface RecordWebhookEventParams {
	provider: string;
	eventType: string;
	externalId: string;
	payload: unknown;
}

// Stores a delivery before it is handled, so a crash or a handler error leaves
// a row that can be retried. `done` is set when an earlier delivery of the same
// event already finished; one that failed or never completed is handled again.
export const recordWebhookEvent = async (
	prisma: PrismaClient,
	params: RecordWebhookEventParams
) => {
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

		return { id: created.id, done: false };
	} catch (error) {
		if ((error as { code?: string } | null)?.code !== UNIQUE_VIOLATION) {
			throw error;
		}

		const existing = await prisma.webhookEvent.update({
			where: {
				provider_externalId: {
					provider: params.provider,
					externalId: params.externalId
				}
			},
			data: { attempts: { increment: 1 } },
			select: { id: true, status: true }
		});

		return {
			id: existing.id,
			done:
				existing.status === WebhookEventStatus.Processed ||
				existing.status === WebhookEventStatus.Skipped
		};
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
