import {
	PrismaClient,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import prismaClient from '../../config/prisma';

// Credit types increase the available balance; debit types decrease it.
const CREDIT_TYPES: TransactionType[] = [
	TransactionType.Revenue,
	TransactionType.Adjustment,
	TransactionType.Refund
];

const DEBIT_TYPES: TransactionType[] = [
	TransactionType.Payout,
	TransactionType.SubscriptionFee
];

export const isCredit = (type: TransactionType): boolean =>
	CREDIT_TYPES.includes(type);

export const isDebit = (type: TransactionType): boolean =>
	DEBIT_TYPES.includes(type);

interface CreateTransactionParams {
	storeId: string;
	type: TransactionType;
	status?: TransactionStatus;
	amount: number;
	description?: string;
	orderId?: string;
}

/**
 * Creates a Transaction record inside an existing Prisma transaction.
 * Computes `balanceAfter` from the most recent transaction for the store.
 * Must be called within a `prisma.$transaction` block.
 */
export const createTransaction = async (
	tx: TransactionClient,
	params: CreateTransactionParams
) => {
	const { storeId, type, status, amount, description, orderId } = params;

	const lastTx = await tx.transaction.findFirst({
		where: { storeId },
		orderBy: { createdAt: 'desc' },
		select: { balanceAfter: true }
	});

	const previousBalance = lastTx?.balanceAfter ?? 0;
	const balanceAfter = isCredit(type)
		? previousBalance + amount
		: previousBalance - amount;

	return tx.transaction.create({
		data: {
			storeId,
			type,
			status: status ?? TransactionStatus.Success,
			amount,
			description: description ?? null,
			orderId: orderId ?? null,
			balanceAfter
		}
	});
};

/**
 * Updates the status of an existing transaction.
 * Must be called within a `prisma.$transaction` block.
 */
export const updateTransactionStatus = async (
	tx: TransactionClient,
	transactionId: string,
	status: TransactionStatus
) => {
	return tx.transaction.update({
		where: { id: transactionId },
		data: { status }
	});
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
) => {
	return prisma.transaction.findUnique({
		where: { id: transactionId },
		include: { order: true, store: true }
	});
};

/**
 * Called by Paystack webhook on transfer.success.
 * The reference is the Transaction ID used as the Paystack transfer reference.
 */
export const markTransferSuccessful = async (reference: string) => {
	await prismaClient.$transaction(async tx => {
		const transaction = await tx.transaction.findUnique({
			where: { id: reference }
		});

		if (!transaction) {
			throw new Error(`Transaction not found: ${reference}`);
		}

		if (
			transaction.type !== TransactionType.Payout ||
			transaction.status !== TransactionStatus.Processing
		) {
			throw new Error(`Transaction ${reference} is not a processing payout`);
		}

		await tx.transaction.update({
			where: { id: reference },
			data: { status: TransactionStatus.Success }
		});

		await tx.store.update({
			where: { id: transaction.storeId },
			data: { paidOut: { increment: transaction.amount } }
		});
	});
};

/**
 * Called by Paystack webhook on transfer.failure.
 * Marks the payout transaction as failed and creates a reversal adjustment.
 */
export const markTransferFailed = async (reference: string) => {
	await prismaClient.$transaction(async tx => {
		const transaction = await tx.transaction.findUnique({
			where: { id: reference }
		});

		if (!transaction) {
			throw new Error(`Transaction not found: ${reference}`);
		}

		if (
			transaction.type !== TransactionType.Payout ||
			transaction.status !== TransactionStatus.Processing
		) {
			throw new Error(`Transaction ${reference} is not a processing payout`);
		}

		await tx.transaction.update({
			where: { id: reference },
			data: { status: TransactionStatus.Failure }
		});

		// Create a reversal adjustment to credit the balance back
		await createTransaction(tx, {
			storeId: transaction.storeId,
			type: TransactionType.Adjustment,
			amount: transaction.amount,
			description: 'Payout transfer failed — reversal'
		});
	});
};

/**
 * Admin action: update the status of a payout-type transaction.
 */
export const adminUpdatePayoutTransaction = async (
	prisma: PrismaClient,
	transactionId: string,
	status: TransactionStatus
) => {
	return prisma.$transaction(async tx => {
		const transaction = await tx.transaction.findUnique({
			where: { id: transactionId }
		});

		if (!transaction) {
			throw new Error('Transaction not found');
		}

		if (transaction.type !== TransactionType.Payout) {
			throw new Error('Only payout transactions can be status-updated');
		}

		if (transaction.status === status) {
			return transaction;
		}

		const updated = await tx.transaction.update({
			where: { id: transactionId },
			data: { status },
			include: { store: true }
		});

		if (
			status === TransactionStatus.Success &&
			transaction.status !== TransactionStatus.Success
		) {
			await tx.store.update({
				where: { id: transaction.storeId },
				data: { paidOut: { increment: transaction.amount } }
			});
		}

		if (
			status === TransactionStatus.Failure &&
			transaction.status !== TransactionStatus.Failure
		) {
			await createTransaction(tx, {
				storeId: transaction.storeId,
				type: TransactionType.Adjustment,
				amount: transaction.amount,
				description: 'Payout failed — reversal (admin)'
			});
		}

		return updated;
	});
};
