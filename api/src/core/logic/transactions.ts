import type { Context } from 'hono';
import * as Sentry from '@sentry/bun';

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
import { runSerializable } from '../../utils/prisma';

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

	if (!(await canManageStore(c))) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new LogicError(LogicErrorCode.NoAccountDetails);
	}

	const storeId = c.var.storeId as string;
	const bankAccountReference = store.bankAccountReference;

	const { transaction, availableForPayout } = await runSerializable(
		c.var.prisma,
		async tx => {
			const lockedStore = await tx.store.findUnique({
				where: { id: storeId },
				select: { realizedRevenue: true, paidOut: true }
			});

			if (!lockedStore) {
				throw new LogicError(LogicErrorCode.StoreNotFound);
			}

			const available = lockedStore.realizedRevenue - lockedStore.paidOut;

			if (amount > available) {
				throw new LogicError(LogicErrorCode.InsufficientFunds);
			}

			const created = await TransactionData.createTransaction(tx, {
				storeId,
				type: TransactionType.Payout,
				status: TransactionStatus.Processing,
				amount,
				description: 'Payout requested'
			});

			return { transaction: created, availableForPayout: available };
		}
	);

	try {
		await PaymentLogic.payAccount(c, {
			amount: amount.toString(),
			reference: transaction.id,
			recipient: bankAccountReference,
			metadata: { transactionId: transaction.id }
		});
	} catch (error) {
		const axiosError = error as {
			response?: { status?: number; data?: unknown };
			code?: string;
			message?: string;
		};

		const context = {
			storeId,
			transactionId: transaction.id,
			amount,
			recipient: bankAccountReference,
			paystackStatus: axiosError.response?.status,
			paystackResponse: axiosError.response?.data,
			errorCode: axiosError.code,
			errorMessage: axiosError.message
		};

		console.error('[payout] payAccount failed', context);

		Sentry.captureException(error, {
			tags: { feature: 'payout', storeId },
			extra: context
		});

		try {
			await runSerializable(c.var.prisma, async tx => {
				const current = await tx.transaction.findUnique({
					where: { id: transaction.id }
				});

				if (!current || current.status !== TransactionStatus.Processing) {
					return;
				}

				await tx.transaction.update({
					where: { id: transaction.id },
					data: { status: TransactionStatus.Failure }
				});

				await TransactionData.createTransaction(tx, {
					storeId,
					type: TransactionType.Adjustment,
					amount,
					description: 'Payout request failed — reversal'
				});
			});
		} catch (reversalError) {
			console.error('[payout] reversal failed', {
				...context,
				reversalError
			});
			Sentry.captureException(reversalError, {
				tags: { feature: 'payout', storeId, phase: 'reversal' },
				extra: context
			});
		}

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
