import * as PayoutData from '../data/payouts';
import * as StoreData from '../data/stores';
import { AppContext } from '../../utils/context';
import { payAccount } from '../payments';
import { PayoutStatus } from '../../generated/prisma/client';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

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
): Promise<
	Result<Awaited<ReturnType<typeof PayoutData.savePayout>>, LogicErrorCode>
> => {
	const { amount } = input;

	try {
		if (!ctx.storeId) {
			return err(LogicErrorCode.StoreContextRequired);
		}

		if (amount <= 0) {
			return err(LogicErrorCode.InvalidInput);
		}

		const store = await StoreData.getStoreByIdWithManagers(
			ctx.prisma,
			ctx.storeId
		);

		if (!store) {
			return err(LogicErrorCode.StoreNotFound);
		}

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const currentUserId = ctx.user.id;

		const isCurrentUserManager = store.managers.some(
			m => m.managerId === currentUserId
		);

		if (!isCurrentUserManager) {
			return err(LogicErrorCode.CannotManageStore);
		}

		const availableForPayout = store.realizedRevenue - store.paidOut;

		if (amount > availableForPayout) {
			return err(LogicErrorCode.InsufficientFunds);
		}

		if (!store.bankAccountReference || !store.bankAccountNumber) {
			return err(LogicErrorCode.NoAccountDetails);
		}

		const payout = await PayoutData.savePayout(ctx.prisma, {
			storeId: ctx.storeId,
			amount
		});

		try {
			await payAccount({
				amount: amount.toString(),
				reference: payout.id,
				recipient: store.bankAccountReference,
				metadata: { payoutId: payout.id }
			});
		} catch (e) {
			console.error('[PayoutLogic.createPayout] payAccount error', e);
			return err(LogicErrorCode.Unexpected);
		}

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

		return ok(payout);
	} catch (e) {
		console.error('[PayoutLogic.createPayout] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface UpdatePayoutInput {
	payoutId: string;
	status: PayoutStatus;
}

export const updatePayout = async (
	ctx: AppContext,
	input: UpdatePayoutInput
): Promise<
	Result<Awaited<ReturnType<typeof PayoutData.updatePayout>>, LogicErrorCode>
> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok(payout);
	} catch (e) {
		console.error('[PayoutLogic.updatePayout] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getStorePayouts = async (
	ctx: AppContext,
	storeId: string
): Promise<
	Result<Awaited<ReturnType<typeof PayoutData.getStorePayouts>>, LogicErrorCode>
> => {
	try {
		if (ctx.storeId && ctx.storeId !== storeId) {
			return err(LogicErrorCode.Forbidden);
		}

		const store = await StoreData.getStoreByIdWithManagers(ctx.prisma, storeId);

		if (!store) {
			return err(LogicErrorCode.StoreNotFound);
		}

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const currentUserId = ctx.user.id;

		const isCurrentUserManager = store.managers.some(
			m => m.managerId === currentUserId
		);

		if (!isCurrentUserManager) {
			return err(LogicErrorCode.CannotManageStore);
		}

		return ok(await PayoutData.getStorePayouts(ctx.prisma, storeId));
	} catch (e) {
		console.error('[PayoutLogic.getStorePayouts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const markPayoutAsSuccessful = async (
	ctx: AppContext,
	input: MarkPayoutSuccessfulInput
): Promise<Result<{ success: true }, LogicErrorCode>> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok({ success: true });
	} catch (e) {
		console.error('[PayoutLogic.markPayoutAsSuccessful] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const markPayoutAsFailed = async (
	ctx: AppContext,
	input: MarkPayoutFailedInput
): Promise<Result<{ success: true }, LogicErrorCode>> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const { reference } = input;

		// Note: This function is typically called by webhooks/system processes
		await PayoutData.markPayoutAsFailed(reference);

		ctx.services.analytics.track({
			event: 'payout_failed',
			distinctId: ctx.user.id,
			properties: { payoutReference: reference }
		});

		return ok({ success: true });
	} catch (e) {
		console.error('[PayoutLogic.markPayoutAsFailed] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getPayouts = async (
	ctx: AppContext,
	query: any
): Promise<
	Result<Awaited<ReturnType<typeof PayoutData.getPayouts>>, LogicErrorCode>
> => {
	try {
		return ok(await PayoutData.getPayouts(ctx.prisma, query));
	} catch (e) {
		console.error('[PayoutLogic.getPayouts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getPayoutById = async (
	ctx: AppContext,
	payoutId: string
): Promise<
	Result<Awaited<ReturnType<typeof PayoutData.getPayoutById>>, LogicErrorCode>
> => {
	try {
		const payout = await PayoutData.getPayoutById(ctx.prisma, payoutId);
		if (!payout) {
			return err(LogicErrorCode.NotFound);
		}
		return ok(payout);
	} catch (e) {
		console.error('[PayoutLogic.getPayoutById] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};
