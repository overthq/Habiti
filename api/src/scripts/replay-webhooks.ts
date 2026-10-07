import prisma from '../config/prisma';
import { WebhookEventStatus } from '../generated/prisma/client';
import {
	getReplayableWebhookEvents,
	markWebhookEventFailed,
	markWebhookEventProcessed,
	PAYSTACK_WEBHOOK_PROVIDER
} from '../core/data/webhookEvents';
import { handlePaystackWebhookEvent } from '../core/logic/payments';
import { rootLogger } from '../services/logger';
import { tracer } from '../services/tracer';
import services from '../services';

/**
 * Reprocesses webhook deliveries that were received but never completed.
 *
 * This is the payoff for persisting the event before dispatching it: a crash
 * or a handler error leaves a `Received`/`Failed` row rather than an event
 * that silently vanished.
 *
 * Safe to run repeatedly. Handlers are individually idempotent, and the
 * journals' idempotency keys mean a replay that has already had its effect
 * posts nothing.
 *
 * Run: cd api && bun run src/scripts/replay-webhooks.ts [--dry-run]
 */

const DRY_RUN = process.argv.includes('--dry-run');

async function replayWebhooks() {
	const events = await getReplayableWebhookEvents(
		prisma,
		PAYSTACK_WEBHOOK_PROVIDER
	);

	rootLogger.info(
		{ pending: events.length, dryRun: DRY_RUN },
		'replay_webhooks.start'
	);

	let replayed = 0;
	let failed = 0;

	for (const event of events) {
		const payload = event.payload as { event?: string; data?: unknown };

		if (!payload?.event) {
			rootLogger.warn(
				{ id: event.id, externalId: event.externalId },
				'replay_webhooks.malformed_payload'
			);

			await prisma.webhookEvent.update({
				where: { id: event.id },
				data: { status: WebhookEventStatus.Skipped }
			});

			continue;
		}

		if (DRY_RUN) {
			rootLogger.info(
				{
					id: event.id,
					eventType: event.eventType,
					status: event.status,
					attempts: event.attempts
				},
				'replay_webhooks.would_replay'
			);
			continue;
		}

		// The handlers reach for a Hono context, but only for prisma, the
		// logger, the tracer and the notification service.
		const c = {
			var: { prisma, logger: rootLogger, tracer, services }
		} as never;

		try {
			await prisma.webhookEvent.update({
				where: { id: event.id },
				data: { attempts: { increment: 1 } }
			});

			await handlePaystackWebhookEvent(
				c,
				payload.event,
				payload.data,
				event.id
			);

			await markWebhookEventProcessed(prisma, event.id);
			replayed++;
		} catch (error) {
			rootLogger.error(
				{ err: error, id: event.id, eventType: event.eventType },
				'replay_webhooks.failed'
			);

			await markWebhookEventFailed(prisma, event.id, error);
			failed++;
		}
	}

	rootLogger.info(
		{ replayed, failed, dryRun: DRY_RUN },
		'replay_webhooks.complete'
	);
}

replayWebhooks()
	.catch(err => {
		rootLogger.error({ err }, 'replay_webhooks.errored');
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
