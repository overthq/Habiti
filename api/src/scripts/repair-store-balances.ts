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
import { rootLogger } from '../services/logger';

/**
 * Reports what is wrong with store balances and, with --write-off, zeroes the
 * negative ones at the platform's expense.
 *
 * Without the flag nothing is written. Replay unprocessed webhooks
 * (`replay-webhooks`) before writing off, so payments that really happened are
 * credited rather than absorbed.
 *
 * Counts log at info. Each reported row logs at debug, with the same fields
 * the table used to print.
 *
 * Run: cd api && bun run src/scripts/repair-store-balances.ts [--write-off]
 */

const WRITE_OFF = process.argv.includes('--write-off');

type StoreBalanceKind = 'Unrealized' | 'Available' | 'PendingPayouts';

async function repairStoreBalances() {
	rootLogger.info({ writeOff: WRITE_OFF }, 'repair_store_balances.start');

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

	rootLogger.info(
		{ count: negativeBalances.length },
		'repair_store_balances.negative_balances'
	);

	for (const row of negativeBalances) {
		rootLogger.debug(
			{
				storeId: row.storeId,
				store: row.store,
				kind: row.kind,
				balance: Number(row.balance),
				openingBalance: Number(row.openingBalance),
				cause: row.openingBalance < 0n ? 'opening balance' : 'later activity'
			},
			'repair_store_balances.negative_balance'
		);
	}

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

	rootLogger.info(
		{ count: unprocessedWebhooks.length },
		'repair_store_balances.unprocessed_webhooks'
	);

	for (const webhook of unprocessedWebhooks) {
		rootLogger.debug(
			{
				id: webhook.id,
				eventType: webhook.eventType,
				status: webhook.status,
				attempts: webhook.attempts,
				error: webhook.error,
				receivedAt: webhook.receivedAt.toISOString()
			},
			'repair_store_balances.unprocessed_webhook'
		);
	}

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

	rootLogger.info(
		{ count: ordersWithoutPayment.length },
		'repair_store_balances.orders_without_payment'
	);

	for (const order of ordersWithoutPayment) {
		rootLogger.debug(
			{
				id: order.id,
				storeId: order.storeId,
				status: order.status,
				total: order.total,
				createdAt: order.createdAt.toISOString()
			},
			'repair_store_balances.order_without_payment'
		);
	}

	const summary = {
		negativeBalances: negativeBalances.length,
		unprocessedWebhooks: unprocessedWebhooks.length,
		ordersWithoutPayment: ordersWithoutPayment.length
	};

	if (!WRITE_OFF) {
		rootLogger.info(
			{ writeOff: false },
			'repair_store_balances.nothing_written'
		);
		rootLogger.info(
			{ writeOff: false, writtenOff: 0, ...summary },
			'repair_store_balances.complete'
		);
		return;
	}

	let writtenOff = 0;

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

		rootLogger.info(
			{
				storeId,
				store,
				kind,
				amount: Number(-balance)
			},
			'repair_store_balances.wrote_off'
		);
		writtenOff++;
	}

	rootLogger.info(
		{ writeOff: true, writtenOff, ...summary },
		'repair_store_balances.complete'
	);
}

repairStoreBalances()
	.catch(err => {
		rootLogger.error({ err }, 'repair_store_balances.failed');
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
