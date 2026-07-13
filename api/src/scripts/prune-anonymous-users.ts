import prisma from '../config/prisma';
import { rootLogger } from '../services/logger';

/**
 * Periodic cleanup for anonymous (guest) users that never converted to a
 * full account. Every guest session creates a `User` row; most are
 * abandoned. A guest is pruned when:
 *
 *   - `isAnonymous` is still true (conversion flips it / merge deletes it),
 *   - the account is older than `RETENTION_DAYS`,
 *   - no session has been active within `RETENTION_DAYS`, and
 *   - they have no orders (order history has bookkeeping value even if the
 *     guest never returns).
 *
 * Cascade deletes clean up their carts, sessions, refresh tokens, etc.
 * Designed to run once a day, batched like prune-sessions.
 */

const RETENTION_DAYS = parseInt(
	process.env.ANONYMOUS_USER_RETENTION_DAYS || '60',
	10
);
const BATCH_SIZE = 1_000;

const cutoff = () => {
	const d = new Date();

	d.setDate(d.getDate() - RETENTION_DAYS);

	return d;
};

async function pruneAnonymousUsers() {
	const before = cutoff();
	rootLogger.info(
		{ retentionDays: RETENTION_DAYS, cutoff: before.toISOString() },
		'prune_anonymous.start'
	);

	let total = 0;

	for (let i = 0; i < 100; i++) {
		const ids = await prisma.user.findMany({
			where: {
				isAnonymous: true,
				createdAt: { lt: before },
				sessions: { none: { lastActiveAt: { gte: before } } },
				orders: { none: {} }
			},
			take: BATCH_SIZE,
			select: { id: true }
		});

		if (ids.length === 0) break;

		const { count } = await prisma.user.deleteMany({
			where: { id: { in: ids.map(u => u.id) } }
		});

		total += count;
		if (count < BATCH_SIZE) break;
	}

	rootLogger.info({ deleted: total }, 'prune_anonymous.complete');
}

pruneAnonymousUsers()
	.catch(err => {
		rootLogger.error({ err }, 'prune_anonymous.failed');
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
