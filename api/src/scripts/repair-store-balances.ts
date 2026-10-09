import { randomUUID } from 'crypto';

import prisma from '../config/prisma';
import {
	AccountKind,
	LedgerReason,
	OrderStatus,
	WebhookEventStatus
} from '../generated/prisma/client';
import { moveMoney } from '../core/data/ledger';
import { runSerializable } from '../utils/prisma';

/**
 * Reports what is wrong with store balances and, with --write-off, zeroes the
 * negative ones at the platform's expense.
 *
 * Without the flag nothing is written. Replay unprocessed webhooks
 * (`replay-webhooks`) before writing off, so payments that really happened are
 * credited rather than absorbed.
 *
 * Run: cd api && bun run src/scripts/repair-store-balances.ts [--write-off]
 */

const WRITE_OFF = process.argv.includes('--write-off');

type StoreBalanceKind = 'Unrealized' | 'Available' | 'PendingPayouts';

async function repairStoreBalances() {
	const negativeBalances = await prisma.$queryRaw<
		{
			storeId: string;
			store: string;
			kind: StoreBalanceKind;
			balance: bigint;
			openingBalance: bigint;
		}[]
	>`
		SELECT
			s."id" AS "storeId",
			s."name" AS "store",
			e."kind",
			SUM(e."change")::bigint AS "balance",
			COALESCE(SUM(e."change") FILTER (WHERE e."reason" = 'OpeningBalance'), 0)::bigint AS "openingBalance"
		FROM (
			SELECT
				a."storeId",
				a."kind",
				t."reason",
				CASE WHEN e."direction" = 'Credit' THEN e."amount" ELSE -e."amount" END AS "change"
			FROM "LedgerEntry" e
			JOIN "LedgerAccount" a ON a."id" = e."accountId"
			JOIN "LedgerTransaction" t ON t."id" = e."transactionId"
			WHERE a."storeId" IS NOT NULL
		) e
		JOIN "Store" s ON s."id" = e."storeId"
		GROUP BY s."id", s."name", e."kind"
		HAVING SUM(e."change") < 0
		ORDER BY s."name"
	`;

	console.log(`\nNegative balances: ${negativeBalances.length}`);
	console.table(
		negativeBalances.map(row => ({
			...row,
			balance: Number(row.balance),
			openingBalance: Number(row.openingBalance),
			cause: row.openingBalance < 0n ? 'opening balance' : 'later activity'
		}))
	);

	const unprocessedWebhooks = await prisma.webhookEvent.findMany({
		where: {
			status: { in: [WebhookEventStatus.Received, WebhookEventStatus.Failed] }
		},
		select: {
			id: true,
			eventType: true,
			status: true,
			attempts: true,
			error: true,
			receivedAt: true
		},
		orderBy: { receivedAt: 'asc' }
	});

	console.log(`\nUnprocessed webhooks: ${unprocessedWebhooks.length}`);
	console.table(unprocessedWebhooks);

	// Orders from before the ledger existed have no payment in it; their money
	// came in through the opening balance.
	const firstLedgerTransaction = await prisma.ledgerTransaction.findFirst({
		orderBy: { createdAt: 'asc' },
		select: { createdAt: true }
	});

	const ordersWithoutPayment = firstLedgerTransaction
		? await prisma.order.findMany({
				where: {
					createdAt: { gte: firstLedgerTransaction.createdAt },
					status: {
						in: [
							OrderStatus.Pending,
							OrderStatus.ReadyForPickup,
							OrderStatus.Completed
						]
					},
					ledgerTransactions: { none: { reason: LedgerReason.OrderPaid } }
				},
				select: {
					id: true,
					storeId: true,
					status: true,
					total: true,
					createdAt: true
				},
				orderBy: { createdAt: 'asc' }
			})
		: [];

	console.log(
		`\nPaid orders with no recorded payment: ${ordersWithoutPayment.length}`
	);
	console.table(ordersWithoutPayment);

	if (!WRITE_OFF) {
		console.log('\nNothing written. Pass --write-off to zero the negatives.');
		return;
	}

	for (const { storeId, store, kind, balance } of negativeBalances) {
		await runSerializable(prisma, tx =>
			moveMoney(tx, {
				key: `write-off:${storeId}:${kind}:${randomUUID()}`,
				reason: LedgerReason.ManualAdjustment,
				amount: -balance,
				from: { kind: AccountKind.PlatformFeeRevenue },
				to: { kind, storeId },
				description: 'Negative balance written off'
			})
		);

		console.log(`Wrote off ${-balance} of ${kind} for ${store} (${storeId})`);
	}
}

repairStoreBalances()
	.catch(error => {
		console.error('Failed to repair store balances:', error);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
