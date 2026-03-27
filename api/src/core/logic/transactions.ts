import * as TransactionData from '../data/transactions';
import * as StoreData from '../data/stores';
import { TransactionFilters } from '../data/transactions';
import { AppContext } from '../../utils/context';
import {
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from './errors';
import { canManageStore } from './permissions';
import { payAccount } from '../payments';
import { createTransaction } from '../data/transactions';

export const getStoreTransactions = async (
	ctx: AppContext,
	storeId: string,
	filters?: TransactionFilters
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (ctx.storeId && ctx.storeId !== storeId && !ctx.isAdmin) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	if (!ctx.isAdmin) {
		const canManage = await canManageStore(ctx);
		if (!canManage) {
			throw new LogicError(LogicErrorCode.CannotManageStore);
		}
	}

	return TransactionData.getTransactionsByStoreId(ctx.prisma, storeId, filters);
};

export const getTransactionById = async (
	ctx: AppContext,
	transactionId: string
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const transaction = await TransactionData.getTransactionById(
		ctx.prisma,
		transactionId
	);

	if (!transaction) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	// Verify the user can access this store's transactions
	if (!ctx.isAdmin) {
		if (ctx.storeId !== transaction.storeId) {
			throw new LogicError(LogicErrorCode.Forbidden);
		}

		const canManage = await canManageStore(ctx);
		if (!canManage) {
			throw new LogicError(LogicErrorCode.CannotManageStore);
		}
	}

	return transaction;
};

interface CreatePayoutTransactionInput {
	amount: number;
}

export const createPayoutTransaction = async (
	ctx: AppContext,
	input: CreatePayoutTransactionInput
) => {
	const { amount } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	if (amount <= 0) {
		throw new LogicError(LogicErrorCode.InvalidInput);
	}

	const store = await StoreData.getStoreByIdWithManagers(
		ctx.prisma,
		ctx.storeId
	);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!canManageStore(ctx)) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const availableForPayout = store.realizedRevenue - store.paidOut;

	if (amount > availableForPayout) {
		throw new LogicError(LogicErrorCode.InsufficientFunds);
	}

	if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new LogicError(LogicErrorCode.NoAccountDetails);
	}

	const storeId = ctx.storeId as string;

	const transaction = await ctx.prisma.$transaction(async tx => {
		return createTransaction(tx, {
			storeId,
			type: TransactionType.Payout,
			status: TransactionStatus.Processing,
			amount,
			description: 'Payout requested'
		});
	});

	await payAccount({
		amount: amount.toString(),
		reference: transaction.id,
		recipient: store.bankAccountReference,
		metadata: { transactionId: transaction.id }
	});

	ctx.services.analytics.track({
		event: 'payout_created',
		distinctId: ctx.user.id,
		properties: {
			storeId,
			amount,
			transactionId: transaction.id,
			storeName: store.name,
			availableBeforePayout: availableForPayout
		},
		groups: { store: storeId }
	});

	return transaction;
};

interface UpdatePayoutTransactionStatusInput {
	transactionId: string;
	status: TransactionStatus;
}

export const updatePayoutTransactionStatus = async (
	ctx: AppContext,
	input: UpdatePayoutTransactionStatusInput
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const updated = await TransactionData.adminUpdatePayoutTransaction(
		ctx.prisma,
		input.transactionId,
		input.status
	);

	ctx.services.analytics.track({
		event: 'payout_transaction_updated',
		distinctId: ctx.user.id,
		properties: {
			transactionId: input.transactionId,
			status: input.status,
			storeId: updated.storeId
		},
		groups: { store: updated.storeId }
	});

	return updated;
};
