import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import type { RedisClient } from 'bun';

import {
	type NotificationPayload,
	notificationTemplates,
	getNotificationUrl
} from '../core/notifications';
import { rootLogger } from './logger';

/**
 * Push-notifications queue backed by a Redis list. Survives process
 * restarts (the previous in-memory queue dropped pending retries on every
 * deploy). Dependency-free — uses the Redis primitives already available
 * to us via Bun's `RedisClient`.
 *
 * Layout
 *   `notifications:queue`         — pending messages (LPUSH on enqueue,
 *                                   LPOP on drain).
 *   `notifications:dead-letter`   — messages that failed `MAX_ATTEMPTS`
 *                                   times. We keep them so a human can
 *                                   inspect; they're not retried.
 *
 * Each item is a JSON string carrying the Expo message + an `_attempts`
 * counter. When a send batch fails we re-enqueue with `_attempts + 1`,
 * routing to the DLQ once the cap is hit.
 *
 * Single-worker per process is fine: with multiple processes the LPOP
 * batches just split work between them — no atomicity issues.
 */

const QUEUE_KEY = 'notifications:queue';
const DLQ_KEY = 'notifications:dead-letter';
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;
const DRAIN_INTERVAL_MS = 15 * 1000;

type WireMessage = ExpoPushMessage & { _attempts?: number };

const expo = new Expo();

export default class NotificationsService {
	private isProcessing = false;
	private timer: ReturnType<typeof setInterval> | null = null;

	constructor(private readonly redis: RedisClient) {
		this.timer = setInterval(() => {
			void this.drain();
		}, DRAIN_INTERVAL_MS);
		// `unref` so the interval doesn't keep Bun alive on shutdown.
		this.timer?.unref?.();
	}

	queueNotification(payload: NotificationPayload) {
		const template = notificationTemplates[payload.type];

		if (!template) {
			rootLogger.error(
				{ type: payload.type },
				'notifications.template_missing'
			);
			return;
		}

		const url = getNotificationUrl(payload.type, payload.data);

		const messages: WireMessage[] = payload.recipientTokens.map(token => ({
			to: token,
			title: template.title,
			body: template.body(payload.data),
			data: {
				type: payload.type,
				...payload.data,
				...(url ? { url } : {})
			}
		}));

		// Fire-and-forget: notifications are non-critical. If Redis is down
		// we log and drop rather than block the request that triggered this.
		void this.push(messages);
	}

	/** Drain the queue immediately — called from graceful shutdown. */
	async flush(): Promise<void> {
		// Stop the timer so it doesn't race with the manual drain.
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		// Loop drains until the queue is empty or `drain()` reports nothing.
		// Bounded by `MAX_FLUSH_ITERATIONS` so a runaway producer can't keep
		// us alive forever during shutdown.
		const MAX_FLUSH_ITERATIONS = 10;
		for (let i = 0; i < MAX_FLUSH_ITERATIONS; i++) {
			const drained = await this.drain();
			if (drained === 0) break;
		}
	}

	private async push(messages: WireMessage[]): Promise<void> {
		if (messages.length === 0) return;
		try {
			const args = [QUEUE_KEY, ...messages.map(m => JSON.stringify(m))];
			// Bun's typed `lpush` is single-value; use the raw `send` form
			// so we can push the whole batch in one round-trip.
			await this.redis.send('LPUSH', args);
		} catch (err) {
			rootLogger.error(
				{ err, count: messages.length },
				'notifications.push_failed'
			);
		}
	}

	/** Returns the count of messages drained on this pass. */
	private async drain(): Promise<number> {
		if (this.isProcessing) return 0;
		this.isProcessing = true;
		let drained = 0;

		try {
			const claimed = await this.claimBatch(BATCH_SIZE);
			if (claimed.length === 0) return 0;
			drained = claimed.length;

			const chunks = expo.chunkPushNotifications(
				// `chunkPushNotifications` expects ExpoPushMessage[] without our
				// internal `_attempts` field; cast is safe — Expo ignores extra
				// keys.
				claimed as ExpoPushMessage[]
			);

			for (const chunk of chunks) {
				try {
					const tickets = await expo.sendPushNotificationsAsync(chunk);
					rootLogger.debug(
						{ ticketCount: tickets.length },
						'notifications.sent'
					);
				} catch (err) {
					rootLogger.error(
						{ err, chunkSize: chunk.length },
						'notifications.send_failed'
					);
					await this.requeueOrDeadLetter(chunk as WireMessage[]);
				}
			}
		} catch (err) {
			rootLogger.error({ err }, 'notifications.drain_failed');
		} finally {
			this.isProcessing = false;
		}

		return drained;
	}

	private async claimBatch(count: number): Promise<WireMessage[]> {
		// `LPOP key count` (Redis 6.2+) returns either `null`, a single
		// string, or an array of strings depending on the server build.
		// Bun's typed `lpop` doesn't accept the count form, so we use raw.
		const raw = await this.redis.send('LPOP', [QUEUE_KEY, String(count)]);
		if (raw === null || raw === undefined) return [];
		const arr = Array.isArray(raw) ? raw : [raw];
		const out: WireMessage[] = [];
		for (const item of arr) {
			try {
				out.push(JSON.parse(String(item)));
			} catch (err) {
				rootLogger.warn(
					{ err, item: String(item).slice(0, 200) },
					'notifications.parse_failed'
				);
			}
		}
		return out;
	}

	private async requeueOrDeadLetter(messages: WireMessage[]): Promise<void> {
		const retry: string[] = [];
		const dead: string[] = [];

		for (const msg of messages) {
			const attempts = (msg._attempts ?? 0) + 1;
			const updated: WireMessage = { ...msg, _attempts: attempts };
			if (attempts >= MAX_ATTEMPTS) {
				dead.push(JSON.stringify(updated));
			} else {
				retry.push(JSON.stringify(updated));
			}
		}

		try {
			if (retry.length > 0) {
				// `RPUSH` to the tail so retries don't starve newer items at
				// the head — they'll be drained on the next interval.
				await this.redis.send('RPUSH', [QUEUE_KEY, ...retry]);
			}
			if (dead.length > 0) {
				await this.redis.send('LPUSH', [DLQ_KEY, ...dead]);
				rootLogger.warn({ count: dead.length }, 'notifications.dead_lettered');
			}
		} catch (err) {
			rootLogger.error(
				{ err, retryCount: retry.length, deadCount: dead.length },
				'notifications.requeue_failed'
			);
		}
	}
}
