import type { Context } from 'hono';
import * as Sentry from '@sentry/bun';

import * as PaymentLogic from './payments';
import * as PayoutAccountLogic from './payoutAccounts';
import * as TransactionData from '../data/transactions';
import * as StoreData from '../data/stores';

import { TransactionFilters } from '../data/transactions';
import type { AppEnv } from '../../types/hono';
import { TransactionStatus } from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from './errors';
import { assertStoreScope } from './permissions';
import { recordPayoutRequested } from '../data/postings';
import { runSerializable } from '../../utils/prisma';

export const getStoreTransactions = async (
	c: Context<AppEnv>,
	storeId: string,
	filters?: TransactionFilters
) => {
	assertStoreScope(c, storeId);

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

	assertStoreScope(c, transaction.storeId);

	return transaction;
};

export const getStoreBalance = async (c: Context<AppEnv>, storeId: string) => {
	assertStoreScope(c, storeId);

	const store = await c.var.prisma.store.findUnique({
		where: { id: storeId },
		select: {
			realizedRevenue: true,
			unrealizedRevenue: true,
			paidOut: true,
			pendingPayouts: true
		}
	});

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	const realizedRevenue = Number(store.realizedRevenue);
	const paidOut = Number(store.paidOut);
	const pendingPayouts = Number(store.pendingPayouts);

	return {
		realizedRevenue,
		unrealizedRevenue: Number(store.unrealizedRevenue),
		paidOut,
		pendingPayouts,
		available: TransactionData.computeAvailableBalance({
			realizedRevenue,
			paidOut,
			pendingPayouts
		})
	};
};

interface CreatePayoutTransactionInput {
	amount: number;
	payoutAccountId?: string | undefined;
}

export const createPayoutTransaction = async (
	c: Context<AppEnv>,
	input: CreatePayoutTransactionInput
) => {
	const { amount, payoutAccountId } = input;

	const { storeId, userId } = assertStoreScope(c);

	if (amount <= 0) {
		throw new LogicError(LogicErrorCode.InvalidInput);
	}

	const store = await StoreData.getStoreByIdWithManagers(c.var.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	// Throws `NoAccountDetails` when the store has no default account, and
	// `PayoutAccountNotFound` when a request names an account that is not this
	// store's or is no longer active.
	const payoutAccount = await PayoutAccountLogic.resolvePayoutAccount(
		c,
		storeId,
		payoutAccountId
	);

	const recipientRef = payoutAccount.recipientRef;

	const { payoutRequest, availableForPayout } = await runSerializable(
		c.var.prisma,
		async tx => {
			const lockedStore = await StoreData.lockStoreBalance(tx, storeId);

			if (!lockedStore) {
				throw new LogicError(LogicErrorCode.StoreNotFound);
			}

			const pendingPayouts = await TransactionData.getPendingPayoutTotal(
				tx,
				storeId
			);

			const available = TransactionData.computeAvailableBalance({
				realizedRevenue: Number(lockedStore.realizedRevenue),
				paidOut: Number(lockedStore.paidOut),
				pendingPayouts
			});

			if (amount > available) {
				throw new LogicError(LogicErrorCode.InsufficientFunds);
			}

			const created = await TransactionData.createPayoutRequest(tx, {
				storeId,
				amount: BigInt(amount),
				payoutAccountId: payoutAccount.id
			});

			// Debits StoreAvailable immediately, so a second request in this
			// window sees the reduced balance rather than the full one.
			await recordPayoutRequested(tx, {
				storeId,
				payoutRequestId: created.id,
				amount: created.amount
			});

			return { payoutRequest: created, availableForPayout: available };
		}
	);

	try {
		await PaymentLogic.payAccount(c, {
			amount: amount.toString(),
			reference: payoutRequest.id,
			recipient: recipientRef,
			metadata: { transactionId: payoutRequest.id }
		});
	} catch (error) {
		const axiosError = error as {
			response?: { status?: number; data?: unknown };
			code?: string;
			message?: string;
		};

		const context = {
			storeId,
			transactionId: payoutRequest.id,
			amount,
			recipient: recipientRef,
			paystackStatus: axiosError.response?.status,
			paystackResponse: axiosError.response?.data,
			errorCode: axiosError.code,
			errorMessage: axiosError.message
		};

		c.var.logger.error({ ...context }, 'payout.payAccount_failed');

		Sentry.captureException(error, {
			tags: { feature: 'payout', storeId },
			extra: context
		});

		try {
			// Reverses through the same path the webhook uses, so a failure
			// here and a `transfer.failure` webhook cannot double-reverse:
			// whichever arrives second finds the request already Failed and
			// short-circuits, and the journal's idempotency key backstops it.
			await TransactionData.markTransferFailed(
				c.var.prisma,
				payoutRequest.id,
				axiosError.message ?? 'Payout request failed'
			);
		} catch (reversalError) {
			c.var.logger.error(
				{ ...context, err: reversalError },
				'payout.reversal_failed'
			);

			Sentry.captureException(reversalError, {
				tags: { feature: 'payout', storeId, phase: 'reversal' },
				extra: context
			});
		}

		throw new LogicError(LogicErrorCode.PayoutFailed);
	}

	c.var.services.analytics.track({
		event: 'payout_created',
		distinctId: userId,
		properties: {
			storeId,
			amount,
			transactionId: payoutRequest.id,
			storeName: store.name,
			payoutAccountId: payoutAccount.id,
			availableBeforePayout: availableForPayout
		},
		groups: { store: storeId }
	});

	// The dashboard expects a `Transaction`-shaped body here, so hand back the
	// statement row the payout produced rather than the raw request.
	return (
		(await TransactionData.getPayoutStatementEntry(
			c.var.prisma,
			payoutRequest.id
		)) ?? payoutRequest
	);
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

	// Hand back the statement row rather than the raw request: it is the shape
	// the admin client already expects, and it carries no bigint for
	// JSON.stringify to choke on.
	const statementEntry = await TransactionData.getPayoutStatementEntry(
		c.var.prisma,
		updated.id
	);

	return statementEntry ?? { ...updated, amount: Number(updated.amount) };
};
