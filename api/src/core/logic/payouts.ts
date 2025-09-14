import * as PayoutData from '../data/payouts';
import * as StoreData from '../data/stores';
import { AppContext } from '../../utils/context';
import { payAccount } from '../payments';

interface CreatePayoutInput {
	amount: number;
}

interface MarkPayoutSuccessfulInput {
	reference: string;
}

interface MarkPayoutFailedInput {
	reference: string;
}

export const createPayout = async (
	ctx: AppContext,
	input: CreatePayoutInput
) => {
	const { amount } = input;

	if (!ctx.storeId) {
		throw new Error('Only a store can carry out this action');
	}

	if (amount <= 0) {
		throw new Error('Payout amount must be greater than zero');
	}

	const store = await StoreData.getStoreById(ctx.prisma, ctx.storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isManager = store.managers.some(m => m.managerId === ctx.user.id);

	if (!isManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	const availableForPayout = store.realizedRevenue - store.paidOut;

	if (amount > availableForPayout) {
		throw new Error(
			`Insufficient funds. Available: ${availableForPayout}, Requested: ${amount}`
		);
	}

	if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new Error('No account details provided');
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

export const getStorePayouts = async (ctx: AppContext, storeId: string) => {
	if (ctx.storeId && ctx.storeId !== storeId) {
		throw new Error('Unauthorized: Cannot view payouts for different store');
	}

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isManager = store.managers.some(m => m.managerId === ctx.user.id);

	if (!isManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	return PayoutData.getStorePayouts(ctx.prisma, storeId);
};

export const markPayoutAsSuccessful = async (
	ctx: AppContext,
	input: MarkPayoutSuccessfulInput
) => {
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

export const markPayoutAsFailed = async (
	ctx: AppContext,
	input: MarkPayoutFailedInput
) => {
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
