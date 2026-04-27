import prisma from '../config/prisma';
import { rootLogger } from '../services/logger';

/**
 * Periodic cleanup for `Session` / `RefreshToken` / `AdminSession` /
 * `AdminRefreshToken` rows that no longer serve a purpose:
 *
 *   - Refresh tokens past `expiresAt` (clients can't use them anymore).
 *   - Refresh tokens revoked more than `RETENTION_DAYS` ago (we keep the
 *     row briefly so reuse-detection can still trip; after the JWT itself
 *     would have expired there's no value in keeping the audit row).
 *   - Sessions whose every refresh token has been pruned and which are
 *     past `RETENTION_DAYS` since `lastActiveAt`.
 *
 * Designed to run once a day. Bounded delete batches so a long run can be
 * interrupted without holding row locks for hours on a hot table.
 */

const RETENTION_DAYS = parseInt(process.env.SESSION_RETENTION_DAYS || '30', 10);
const BATCH_SIZE = 1_000;

const cutoff = () => {
	const d = new Date();

	d.setDate(d.getDate() - RETENTION_DAYS);

	return d;
};

const deleteInBatches = async (
	label: string,
	deleteOnce: () => Promise<{ count: number }>
): Promise<number> => {
	let total = 0;

	for (let i = 0; i < 100; i++) {
		const { count } = await deleteOnce();
		total += count;
		if (count < BATCH_SIZE) break;
	}

	rootLogger.info({ label, deleted: total }, 'prune.batch_done');

	return total;
};

async function pruneSessions() {
	const before = cutoff();
	rootLogger.info(
		{ retentionDays: RETENTION_DAYS, cutoff: before.toISOString() },
		'prune.start'
	);

	// Refresh tokens (user-side):
	//   - Expired AND created before the retention cutoff, OR
	//   - Revoked AND `updatedAt` (which Prisma bumps on the revoke update)
	//     is older than the cutoff.
	const refreshTokensDeleted = await deleteInBatches(
		'RefreshToken',
		async () => {
			const ids = await prisma.refreshToken.findMany({
				where: {
					OR: [
						{ expiresAt: { lt: before } },
						{ revoked: true, updatedAt: { lt: before } }
					]
				},
				take: BATCH_SIZE,
				select: { id: true }
			});

			if (ids.length === 0) return { count: 0 };

			return prisma.refreshToken.deleteMany({
				where: { id: { in: ids.map(r => r.id) } }
			});
		}
	);

	const adminRefreshTokensDeleted = await deleteInBatches(
		'AdminRefreshToken',
		async () => {
			const ids = await prisma.adminRefreshToken.findMany({
				where: {
					OR: [
						{ expiresAt: { lt: before } },
						{ revoked: true, updatedAt: { lt: before } }
					]
				},
				take: BATCH_SIZE,
				select: { id: true }
			});

			if (ids.length === 0) return { count: 0 };

			return prisma.adminRefreshToken.deleteMany({
				where: { id: { in: ids.map(r => r.id) } }
			});
		}
	);

	// Sessions: only delete if there are no remaining refresh tokens
	// pointing at them AND they've been idle past the cutoff. A session
	// with `revoked: true` qualifies because all its tokens were revoked
	// at the same time.
	const sessionsDeleted = await deleteInBatches('Session', async () => {
		const ids = await prisma.session.findMany({
			where: {
				lastActiveAt: { lt: before },
				refreshTokens: { none: {} }
			},
			take: BATCH_SIZE,
			select: { id: true }
		});

		if (ids.length === 0) return { count: 0 };

		return prisma.session.deleteMany({
			where: { id: { in: ids.map(r => r.id) } }
		});
	});

	const adminSessionsDeleted = await deleteInBatches(
		'AdminSession',
		async () => {
			const ids = await prisma.adminSession.findMany({
				where: {
					lastActiveAt: { lt: before },
					refreshTokens: { none: {} }
				},
				take: BATCH_SIZE,
				select: { id: true }
			});

			if (ids.length === 0) return { count: 0 };

			return prisma.adminSession.deleteMany({
				where: { id: { in: ids.map(r => r.id) } }
			});
		}
	);

	rootLogger.info(
		{
			refreshTokensDeleted,
			adminRefreshTokensDeleted,
			sessionsDeleted,
			adminSessionsDeleted
		},
		'prune.complete'
	);
}

pruneSessions()
	.catch(err => {
		rootLogger.error({ err }, 'prune.failed');
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
