import { randomUUID } from 'crypto';

import {
	AccountKind,
	LedgerReason,
	PayoutStatus,
	PrismaClient,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import { runSerializable } from '../../utils/prisma';
import { moveMoney } from './ledger';

export const computeAvailableBalance = (params: {
	realizedRevenue: number;
	paidOut: number;
	pendingPayouts: number;
}) => params.realizedRevenue - params.paidOut - params.pendingPayouts;

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
) => {
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

	return prisma.transaction.findMany({
		where,
		orderBy: { createdAt: 'desc' },
		take: filters?.limit ?? 50,
		skip: filters?.offset ?? 0,
		include: { order: true }
	});
};

export const getTransactionById = async (
	prisma: PrismaClient,
	transactionId: string
) =>
	prisma.transaction.findUnique({
		where: { id: transactionId },
		include: { order: true, store: true }
	});

export const getPayoutById = async (prisma: PrismaClient, payoutId: string) =>
	prisma.payout.findUnique({ where: { id: payoutId } });

// The transaction a merchant sees for a payout. Its id is not the payout's id.
export const getPayoutTransaction = async (
	prisma: PrismaClient,
	payoutId: string
) =>
	prisma.transaction.findFirst({
		where: { payoutId, type: TransactionType.Payout }
	});

interface CreatePayoutParams {
	storeId: string;
	amount: bigint;
	payoutAccountId?: string | undefined;
}

// The payout's id doubles as the Paystack transfer reference.
export const createPayout = async (
	tx: TransactionClient,
	params: CreatePayoutParams
) => {
	const id = randomUUID();

	const payout = await tx.payout.create({
		data: {
			id,
			providerRef: id,
			storeId: params.storeId,
			amount: params.amount,
			status: PayoutStatus.Processing,
			...(params.payoutAccountId
				? { payoutAccountId: params.payoutAccountId }
				: {})
		}
	});

	await moveMoney(tx, {
		key: `payout:${id}:requested`,
		reason: LedgerReason.PayoutRequested,
		amount: params.amount,
		from: { kind: AccountKind.Available, storeId: params.storeId },
		to: { kind: AccountKind.PendingPayouts, storeId: params.storeId },
		description: 'Payout requested',
		payoutId: id
	});

	return payout;
};

export const markTransferSuccessful = async (
	prisma: PrismaClient,
	payoutId: string,
	webhookEventId?: string | null
) => {
	await runSerializable(prisma, async tx => {
		const payout = await tx.payout.findUnique({ where: { id: payoutId } });

		if (!payout) {
			throw new Error(`Payout not found: ${payoutId}`);
		}

		if (payout.status === PayoutStatus.Settled) {
			return;
		}

		if (payout.status !== PayoutStatus.Processing) {
			throw new Error(
				`Payout ${payoutId} cannot transition from ${payout.status} to Settled`
			);
		}

		await tx.payout.update({
			where: { id: payoutId },
			data: { status: PayoutStatus.Settled }
		});

		await tx.transaction.updateMany({
			where: { payoutId, type: TransactionType.Payout },
			data: { status: TransactionStatus.Success }
		});

		await moveMoney(tx, {
			key: `payout:${payoutId}:settled`,
			reason: LedgerReason.PayoutSettled,
			amount: payout.amount,
			from: { kind: AccountKind.PendingPayouts, storeId: payout.storeId },
			to: { kind: AccountKind.PlatformCash },
			description: 'Payout settled',
			payoutId,
			webhookEventId
		});
	});
};

interface MarkTransferFailedParams {
	failureReason: string;
	webhookEventId?: string | null | undefined;
	// Paystack can reverse a transfer it already reported as successful.
	allowSettled?: boolean;
}

export const markTransferFailed = async (
	prisma: PrismaClient,
	payoutId: string,
	params: MarkTransferFailedParams
) => {
	await runSerializable(prisma, async tx => {
		const payout = await tx.payout.findUnique({ where: { id: payoutId } });

		if (!payout) {
			throw new Error(`Payout not found: ${payoutId}`);
		}

		if (payout.status === PayoutStatus.Failed) {
			return;
		}

		if (payout.status === PayoutStatus.Settled && !params.allowSettled) {
			throw new Error(
				`Payout ${payoutId} cannot transition from Settled to Failed`
			);
		}

		await tx.payout.update({
			where: { id: payoutId },
			data: {
				status: PayoutStatus.Failed,
				failureReason: params.failureReason
			}
		});

		await tx.transaction.updateMany({
			where: { payoutId, type: TransactionType.Payout },
			data: { status: TransactionStatus.Failure }
		});

		const pendingPayouts = {
			kind: AccountKind.PendingPayouts,
			storeId: payout.storeId
		};

		if (payout.status === PayoutStatus.Settled) {
			// The settlement run backwards. It keeps the PayoutSettled reason
			// because that is what `paidOut` is summed from, so this takes the
			// amount back out of it.
			await moveMoney(tx, {
				key: `payout:${payoutId}:settlement-reversed`,
				reason: LedgerReason.PayoutSettled,
				amount: payout.amount,
				from: { kind: AccountKind.PlatformCash },
				to: pendingPayouts,
				description: 'Payout settlement reversed',
				payoutId,
				webhookEventId: params.webhookEventId
			});
		}

		await moveMoney(tx, {
			key: `payout:${payoutId}:failed`,
			reason: LedgerReason.PayoutFailed,
			amount: payout.amount,
			from: pendingPayouts,
			to: { kind: AccountKind.Available, storeId: payout.storeId },
			description: 'Payout failed — reversed',
			payoutId,
			webhookEventId: params.webhookEventId
		});
	});
};

// The admin panel holds the id of the transaction it listed; the payout's own
// id is accepted too.
export const adminUpdatePayoutTransaction = async (
	prisma: PrismaClient,
	transactionId: string,
	status: TransactionStatus
) => {
	const transaction = await prisma.transaction.findUnique({
		where: { id: transactionId },
		select: { payoutId: true }
	});

	const payoutId = transaction ? transaction.payoutId : transactionId;
	const payout = payoutId ? await getPayoutById(prisma, payoutId) : null;

	if (!payout) {
		throw new Error(`Payout not found: ${transactionId}`);
	}

	if (status === TransactionStatus.Success) {
		await markTransferSuccessful(prisma, payout.id);
	} else if (status === TransactionStatus.Failure) {
		await markTransferFailed(prisma, payout.id, {
			failureReason: 'Marked failed by admin'
		});
	} else {
		throw new Error(`Cannot set a payout to ${status}`);
	}

	return prisma.payout.findUniqueOrThrow({ where: { id: payout.id } });
};
