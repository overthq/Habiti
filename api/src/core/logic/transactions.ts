import type { Context } from 'hono';

import * as PaymentLogic from './payments';
import * as TransactionData from '../data/transactions';
import * as StoreData from '../data/stores';

import { TransactionFilters } from '../data/transactions';
import type { AppEnv } from '../../types/hono';
import {
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from './errors';
import { canManageStore } from './permissions';

export const getStoreTransactions = async (
	c: Context<AppEnv>,
	storeId: string,
	filters?: TransactionFilters
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (c.var.storeId && c.var.storeId !== storeId && !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	if (!c.var.isAdmin) {
		const canManage = await canManageStore(c);
		if (!canManage) {
			throw new LogicError(LogicErrorCode.CannotManageStore);
		}
	}

	return TransactionData.getTransactionsByStoreId(
		c.var.prisma,
		storeId,
		filters
	);
};

export const getTransactionById = async (
	c: Context<AppEnv>,
	transactionId: string
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const transaction = await TransactionData.getTransactionById(
		c.var.prisma,
		transactionId
	);

	if (!transaction) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	// Verify the user can access this store's transactions
	if (!c.var.isAdmin) {
		if (c.var.storeId !== transaction.storeId) {
			throw new LogicError(LogicErrorCode.Forbidden);
		}

		const canManage = await canManageStore(c);
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
	c: Context<AppEnv>,
	input: CreatePayoutTransactionInput
) => {
	const { amount } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	if (amount <= 0) {
		throw new LogicError(LogicErrorCode.InvalidInput);
	}

	const store = await StoreData.getStoreByIdWithManagers(
		c.var.prisma,
		c.var.storeId
	);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!canManageStore(c)) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const availableForPayout = store.realizedRevenue - store.paidOut;

	if (amount > availableForPayout) {
		throw new LogicError(LogicErrorCode.InsufficientFunds);
	}

	if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new LogicError(LogicErrorCode.NoAccountDetails);
	}

	const storeId = c.var.storeId as string;

	const transaction = await c.var.prisma.$transaction(async tx => {
		return TransactionData.createTransaction(tx, {
			storeId,
			type: TransactionType.Payout,
			status: TransactionStatus.Processing,
			amount,
			description: 'Payout requested'
		});
	});

	try {
		await PaymentLogic.payAccount(c, {
			amount: amount.toString(),
			reference: transaction.id,
			recipient: store.bankAccountReference,
			metadata: { transactionId: transaction.id }
		});
	} catch (error) {
		await TransactionData.updateTransactionStatus(
			c.var.prisma,
			transaction.id,
			TransactionStatus.Failure
		);

		throw new LogicError(LogicErrorCode.PayoutFailed);
	}

	c.var.services.analytics.track({
		event: 'payout_created',
		distinctId: c.var.auth.id,
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
	c: Context<AppEnv>,
	input: UpdatePayoutTransactionStatusInput
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const updated = await TransactionData.adminUpdatePayoutTransaction(
		c.var.prisma,
		input.transactionId,
		input.status
	);

	c.var.services.analytics.track({
		event: 'payout_transaction_updated',
		distinctId: c.var.auth.id,
		properties: {
			transactionId: input.transactionId,
			status: input.status,
			storeId: updated.storeId
		},
		groups: { store: updated.storeId }
	});

	return updated;
};
