import {
	AccountKind,
	EntryDirection,
	LedgerReason,
	PrismaClient,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

type Account =
	| { kind: 'PlatformCash' | 'PlatformFeeRevenue' }
	| { kind: 'Unrealized' | 'Available' | 'PendingPayouts'; storeId: string }
	| { kind: 'CustomerCredit'; userId: string };

interface MoveMoneyArgs {
	// Unique per business event (e.g. `order:<id>:paid`), so a retry is a no-op.
	key: string;
	reason: LedgerReason;
	amount: bigint;
	from: Account;
	to: Account;
	description: string;
	orderId?: string;
	payoutId?: string;
	webhookEventId?: string | null | undefined;
}

// Every change to a store's or customer's money goes through here. Returns
// null when `key` has already been recorded.
//
// `from` is debited and `to` is credited. Every account is money we owe
// someone, except PlatformCash, which is money we hold: it is `from` when
// money comes in and `to` when money goes out.
export const moveMoney = async (tx: TransactionClient, args: MoveMoneyArgs) => {
	if (args.amount <= 0n) {
		throw new Error(`Cannot move a non-positive amount: ${args.amount}`);
	}

	const existing = await tx.ledgerTransaction.findUnique({
		where: { idempotencyKey: args.key },
		select: { id: true }
	});

	if (existing) return null;

	const from = await getAccount(tx, args.from);
	const to = await getAccount(tx, args.to);

	const ledgerTransaction = await tx.ledgerTransaction.create({
		data: {
			idempotencyKey: args.key,
			reason: args.reason,
			description: args.description,
			orderId: args.orderId ?? null,
			payoutId: args.payoutId ?? null,
			webhookEventId: args.webhookEventId ?? null,
			entries: {
				create: [
					{
						accountId: from.id,
						direction: EntryDirection.Debit,
						amount: args.amount
					},
					{
						accountId: to.id,
						direction: EntryDirection.Credit,
						amount: args.amount
					}
				]
			}
		}
	});

	if (
		from.kind !== AccountKind.PlatformCash &&
		from.kind !== AccountKind.PlatformFeeRevenue &&
		(await getAccountBalance(tx, from.id)) < 0n
	) {
		throw new Error(
			`Insufficient ${from.kind} balance to move ${args.amount} (${args.key})`
		);
	}

	const storeId = from.storeId ?? to.storeId;

	if (storeId) {
		await recalculateStoreBalance(tx, storeId);
	}

	// Merchants see a transaction whenever their withdrawable balance changes.
	const available = [from, to].find(a => a.kind === AccountKind.Available);

	if (available?.storeId) {
		const isPayout = args.reason === LedgerReason.PayoutRequested;

		await tx.transaction.create({
			data: {
				storeId: available.storeId,
				type:
					args.reason === LedgerReason.OrderCompleted
						? TransactionType.Revenue
						: isPayout
							? TransactionType.Payout
							: TransactionType.Adjustment,
				status: isPayout
					? TransactionStatus.Processing
					: TransactionStatus.Success,
				amount: args.amount,
				description: args.description,
				orderId: args.orderId ?? null,
				payoutId: args.payoutId ?? null,
				balanceAfter: await getAccountBalance(tx, available.id)
			}
		});
	}

	return ledgerTransaction;
};

// Sets the store's revenue columns from the ledger. Safe to run at any time:
// it is also how a store whose columns have drifted is repaired.
//
// `realizedRevenue` is a lifetime figure: what is available now plus
// everything already withdrawn or being withdrawn.
export const recalculateStoreBalance = async (
	tx: TransactionClient,
	storeId: string
) => {
	await tx.$executeRaw`
		UPDATE "Store"
		SET
			"unrealizedRevenue" = b."unrealized",
			"pendingPayouts" = b."pendingPayouts",
			"paidOut" = b."paidOut",
			"realizedRevenue" = b."available" + b."pendingPayouts" + b."paidOut"
		FROM (
			SELECT
				COALESCE(SUM(e."change") FILTER (WHERE e."kind" = 'Unrealized'), 0)::bigint AS "unrealized",
				COALESCE(SUM(e."change") FILTER (WHERE e."kind" = 'Available'), 0)::bigint AS "available",
				COALESCE(SUM(e."change") FILTER (WHERE e."kind" = 'PendingPayouts'), 0)::bigint AS "pendingPayouts",
				COALESCE(-SUM(e."change") FILTER (WHERE e."kind" = 'PendingPayouts' AND e."reason" = 'PayoutSettled'), 0)::bigint AS "paidOut"
			FROM (
				SELECT
					a."kind",
					t."reason",
					CASE WHEN e."direction" = 'Credit' THEN e."amount" ELSE -e."amount" END AS "change"
				FROM "LedgerEntry" e
				JOIN "LedgerAccount" a ON a."id" = e."accountId"
				JOIN "LedgerTransaction" t ON t."id" = e."transactionId"
				WHERE a."storeId" = ${storeId}
			) e
		) b
		WHERE "Store"."id" = ${storeId}
	`;
};

const getAccount = async (tx: TransactionClient, account: Account) => {
	const owner = {
		kind: account.kind,
		storeId: 'storeId' in account ? account.storeId : null,
		userId: 'userId' in account ? account.userId : null
	};

	return (
		(await tx.ledgerAccount.findFirst({ where: owner })) ??
		(await tx.ledgerAccount.create({ data: owner }))
	);
};

const getAccountBalance = async (
	prisma: PrismaClient | TransactionClient,
	accountId: string
) => {
	const sums = await prisma.ledgerEntry.groupBy({
		by: ['direction'],
		where: { accountId },
		_sum: { amount: true }
	});

	const sumFor = (direction: EntryDirection) =>
		sums.find(row => row.direction === direction)?._sum.amount ?? 0n;

	return sumFor(EntryDirection.Credit) - sumFor(EntryDirection.Debit);
};

export const getCustomerCredit = async (
	prisma: PrismaClient | TransactionClient,
	userId: string
) => {
	const account = await prisma.ledgerAccount.findFirst({
		where: { kind: AccountKind.CustomerCredit, userId },
		select: { id: true }
	});

	return account ? getAccountBalance(prisma, account.id) : 0n;
};
