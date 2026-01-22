import * as PayoutData from '../data/payouts';
import * as StoreData from '../data/stores';
import { AppContext } from '../../utils/context';
import { payAccount } from '../payments';
import { PayoutStatus } from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from './errors';

interface CreatePayoutInput {
	amount: number;
}

export const createPayout = async (
	ctx: AppContext,
	input: CreatePayoutInput
) => {
	const { amount } = input;

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

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const availableForPayout = store.realizedRevenue - store.paidOut;

	if (amount > availableForPayout) {
		throw new LogicError(LogicErrorCode.InsufficientFunds);
	}

	if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new LogicError(LogicErrorCode.NoAccountDetails);
	}

	const payout = await PayoutData.savePayout(ctx.prisma, {
		storeId: ctx.storeId,
		amount
	});

	await payAccount({
		amount: amount.toString(),
		reference: payout.id,
		recipient: store.bankAccountReference,
		metadata: { payoutId: payout.id }
	});

	ctx.services.analytics.track({
		event: 'payout_created',
		distinctId: ctx.user.id,
		properties: {
			storeId: ctx.storeId,
			amount,
			storeName: store.name,
			availableBeforePayout: availableForPayout
		},
		groups: { store: ctx.storeId }
	});

	return payout;
};

interface UpdatePayoutInput {
	payoutId: string;
	status: PayoutStatus;
}

export const updatePayout = async (
	ctx: AppContext,
	input: UpdatePayoutInput
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const payout = await PayoutData.updatePayout(ctx.prisma, input);

	ctx.services.analytics.track({
		event: 'payout_updated',
		distinctId: ctx.user.id,
		properties: {
			storeId: ctx.storeId,
			amount: payout.amount,
			storeName: payout.store.name,
			status: payout.status
		},
		groups: { store: payout.storeId }
	});

	return payout;
};

export const getStorePayouts = async (ctx: AppContext, storeId: string) => {
	if (ctx.storeId && ctx.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const store = await StoreData.getStoreByIdWithManagers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	return PayoutData.getStorePayouts(ctx.prisma, storeId);
};

interface MarkPayoutSuccessfulInput {
	reference: string;
}

export const markPayoutAsSuccessful = async (
	ctx: AppContext,
	input: MarkPayoutSuccessfulInput
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const { reference } = input;

	// Note: This function is typically called by webhooks/system processes
	// but we still track analytics for audit purposes
	await PayoutData.markPayoutAsSuccessful(reference);

	ctx.services.analytics.track({
		event: 'payout_successful',
		distinctId: ctx.user.id,
		properties: { payoutReference: reference }
	});

	return { success: true };
};

interface MarkPayoutFailedInput {
	reference: string;
}

export const markPayoutAsFailed = async (
	ctx: AppContext,
	input: MarkPayoutFailedInput
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const { reference } = input;

	// Note: This function is typically called by webhooks/system processes
	await PayoutData.markPayoutAsFailed(reference);

	ctx.services.analytics.track({
		event: 'payout_failed',
		distinctId: ctx.user.id,
		properties: { payoutReference: reference }
	});

	return { success: true };
};

export const getPayouts = async (ctx: AppContext, query: any) => {
	return PayoutData.getPayouts(ctx.prisma, query);
};

export const getPayoutById = async (ctx: AppContext, payoutId: string) => {
	const payout = await PayoutData.getPayoutById(ctx.prisma, payoutId);

	if (!payout) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return payout;
};
