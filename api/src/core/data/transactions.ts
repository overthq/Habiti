import {
	LedgerReason,
	PayoutStatus,
	PrismaClient,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import { runSerializable } from '../../utils/prisma';
import { recordPayoutFailed, recordPayoutSettled } from './postings';

export interface TransactionView {
	id: string;
	storeId: string;
	type: TransactionType;
	status: TransactionStatus;
	amount: number;
	description: string | null;
	orderId: string | null;
	balanceAfter: number;
	createdAt: Date;
	updatedAt: Date;
	order?: unknown;
}

interface StatementRowRecord {
	id: string;
	storeId: string;
	type: TransactionType;
	status: TransactionStatus;
	amount: bigint;
	description: string | null;
	orderId: string | null;
	balanceAfter: bigint;
	createdAt: Date;
	updatedAt: Date;
	order?: unknown;
}

const toTransactionView = (row: StatementRowRecord): TransactionView => ({
	id: row.id,
	storeId: row.storeId,
	type: row.type,
	status: row.status,
	amount: Number(row.amount),
	description: row.description,
	orderId: row.orderId,
	balanceAfter: Number(row.balanceAfter),
	createdAt: row.createdAt,
	updatedAt: row.updatedAt,
	...(row.order === undefined ? {} : { order: row.order })
});

export const computeAvailableBalance = (params: {
	realizedRevenue: number;
	paidOut: number;
	pendingPayouts: number;
}) => params.realizedRevenue - params.paidOut - params.pendingPayouts;

export const getPendingPayoutTotal = async (
	tx: TransactionClient,
	storeId: string
): Promise<number> => {
	const store = await tx.store.findUnique({
		where: { id: storeId },
		select: { pendingPayouts: true }
	});

	return Number(store?.pendingPayouts ?? 0n);
};

export interface TransactionFilters {
	type?: TransactionType | undefined;
	status?: TransactionStatus | undefined;
	from?: string | undefined;
	to?: string | undefined;
	limit?: number | undefined;
	offset?: number | undefined;
}

export const getTransactionsByStoreId = async (
	prisma: PrismaClient,
	storeId: string,
	filters?: TransactionFilters
): Promise<TransactionView[]> => {
	const where: Record<string, unknown> = { storeId };

	if (filters?.type) {
		where.type = filters.type;
	}

	if (filters?.status) {
		where.status = filters.status;
	}

	if (filters?.from || filters?.to) {
		where.createdAt = {
			...(filters.from ? { gte: new Date(filters.from) } : {}),
			...(filters.to ? { lte: new Date(filters.to) } : {})
		};
	}

	const rows = await prisma.storeStatementEntry.findMany({
		where,
		orderBy: { sequence: 'desc' },
		take: filters?.limit ?? 50,
		skip: filters?.offset ?? 0,
		include: { order: true }
	});

	return rows.map(toTransactionView);
};

export const getTransactionById = async (
	prisma: PrismaClient,
	transactionId: string
): Promise<(TransactionView & { store: unknown }) | null> => {
	const row = await prisma.storeStatementEntry.findUnique({
		where: { id: transactionId },
		include: { order: true, store: true }
	});

	if (!row) return null;

	return { ...toTransactionView(row), store: row.store };
};

// --- Payout lifecycle -----------------------------------------------------

export const getPayoutRequestById = async (
	prisma: PrismaClient | TransactionClient,
	payoutRequestId: string
) => prisma.payoutRequest.findUnique({ where: { id: payoutRequestId } });

interface CreatePayoutRequestParams {
	storeId: string;
	amount: bigint;
	/// Optional so the fake ledger and any pre-account caller still work;
	/// `createPayoutTransaction` always supplies it.
	payoutAccountId?: string | undefined;
}

export const createPayoutRequest = async (
	tx: TransactionClient,
	params: CreatePayoutRequestParams
) => {
	const request = await tx.payoutRequest.create({
		data: {
			storeId: params.storeId,
			amount: params.amount,
			status: PayoutStatus.Processing,
			...(params.payoutAccountId
				? { payoutAccountId: params.payoutAccountId }
				: {})
		}
	});

	return tx.payoutRequest.update({
		where: { id: request.id },
		data: { providerRef: request.id }
	});
};

/**
 * Advances a payout to Settled and posts the journal that moves the money out
 * of the platform.
 *
 * Idempotent twice over: the status guard short-circuits a replay, and the
 * journal's idempotency key would reject a second posting even if it did not.
 */
export const markTransferSuccessful = async (
	prisma: PrismaClient,
	reference: string,
	webhookEventId?: string | null
) => {
	await runSerializable(prisma, async tx => {
		const request = await tx.payoutRequest.findUnique({
			where: { id: reference }
		});

		if (!request) {
			throw new Error(`Payout request not found: ${reference}`);
		}

		if (request.status === PayoutStatus.Settled) {
			return;
		}

		if (request.status !== PayoutStatus.Processing) {
			throw new Error(
				`Payout ${reference} cannot transition from ${request.status} to Settled`
			);
		}

		await tx.payoutRequest.update({
			where: { id: reference },
			data: { status: PayoutStatus.Settled }
		});

		await recordPayoutSettled(tx, {
			storeId: request.storeId,
			payoutRequestId: request.id,
			amount: request.amount,
			webhookEventId: webhookEventId ?? null
		});
	});
};

export const markTransferFailed = async (
	prisma: PrismaClient,
	reference: string,
	failureReason?: string | null,
	webhookEventId?: string | null
) => {
	await runSerializable(prisma, async tx => {
		const request = await tx.payoutRequest.findUnique({
			where: { id: reference }
		});

		if (!request) {
			throw new Error(`Payout request not found: ${reference}`);
		}

		if (request.status === PayoutStatus.Failed) {
			return;
		}

		if (request.status !== PayoutStatus.Processing) {
			throw new Error(
				`Payout ${reference} cannot transition from ${request.status} to Failed`
			);
		}

		await tx.payoutRequest.update({
			where: { id: reference },
			data: {
				status: PayoutStatus.Failed,
				failureReason: failureReason ?? null
			}
		});

		await recordPayoutFailed(tx, {
			storeId: request.storeId,
			payoutRequestId: request.id,
			amount: request.amount,
			webhookEventId: webhookEventId ?? null
		});
	});
};

export const resolvePayoutRequestId = async (
	prisma: PrismaClient,
	id: string
): Promise<string | null> => {
	const entry = await prisma.storeStatementEntry.findUnique({
		where: { id },
		select: { transactionId: true }
	});

	if (entry) {
		const journal = await prisma.ledgerTransaction.findUnique({
			where: { id: entry.transactionId },
			select: { payoutRequestId: true }
		});

		return journal?.payoutRequestId ?? null;
	}

	const request = await prisma.payoutRequest.findUnique({
		where: { id },
		select: { id: true }
	});

	return request?.id ?? null;
};

export const adminUpdatePayoutTransaction = async (
	prisma: PrismaClient,
	transactionId: string,
	status: TransactionStatus
) => {
	const payoutRequestId = await resolvePayoutRequestId(prisma, transactionId);

	if (!payoutRequestId) {
		throw new Error(`Payout request not found: ${transactionId}`);
	}

	if (status === TransactionStatus.Success) {
		await markTransferSuccessful(prisma, payoutRequestId);
	} else if (status === TransactionStatus.Failure) {
		await markTransferFailed(prisma, payoutRequestId, 'Marked failed by admin');
	} else {
		throw new Error(`Cannot set a payout to ${status}`);
	}

	const request = await prisma.payoutRequest.findUnique({
		where: { id: payoutRequestId }
	});

	if (!request) {
		throw new Error(`Payout request not found: ${payoutRequestId}`);
	}

	return request;
};

export const getPayoutStatementEntry = async (
	prisma: PrismaClient | TransactionClient,
	payoutRequestId: string
): Promise<TransactionView | null> => {
	const journal = await prisma.ledgerTransaction.findFirst({
		where: { payoutRequestId, reason: LedgerReason.PayoutRequested },
		select: { id: true }
	});

	if (!journal) return null;

	const row = await prisma.storeStatementEntry.findUnique({
		where: { transactionId: journal.id }
	});

	return row ? toTransactionView(row) : null;
};
