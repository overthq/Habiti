import {
	PayoutAccountStatus,
	PayoutStatus,
	PrismaClient
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

/**
 * Storage for store payout destinations.
 *
 * Rows are append-only in spirit: the only fields that change after creation
 * are `isDefault`, `status` and `deactivatedAt`. The bank details themselves
 * are never rewritten, so a `PayoutRequest` pointing at a row always resolves
 * to the account the money was actually sent to.
 */

export const PAYSTACK_PROVIDER = 'paystack';

export interface PayoutAccountIdentity {
	provider: string;
	bankCode: string;
	accountNumber: string;
}

export interface CreatePayoutAccountParams extends PayoutAccountIdentity {
	storeId: string;
	accountName: string;
	bankName: string;
	recipientRef: string;
	label?: string | undefined;
	isDefault: boolean;
}

type Client = PrismaClient | TransactionClient;

export const listPayoutAccounts = async (
	prisma: Client,
	storeId: string,
	options?: { includeInactive?: boolean }
) => {
	return prisma.storePayoutAccount.findMany({
		where: {
			storeId,
			...(options?.includeInactive
				? {}
				: { status: PayoutAccountStatus.Active })
		},
		orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
	});
};

export const countActivePayoutAccounts = async (
	prisma: Client,
	storeId: string
) => {
	return prisma.storePayoutAccount.count({
		where: { storeId, status: PayoutAccountStatus.Active }
	});
};

/**
 * Scoped to the store on purpose: an id alone must never be enough to read or
 * act on another store's account.
 */
export const getPayoutAccountById = async (
	prisma: Client,
	storeId: string,
	id: string
) => {
	return prisma.storePayoutAccount.findFirst({ where: { id, storeId } });
};

export const getDefaultPayoutAccount = async (
	prisma: Client,
	storeId: string
) => {
	return prisma.storePayoutAccount.findFirst({
		where: {
			storeId,
			status: PayoutAccountStatus.Active,
			isDefault: true
		}
	});
};

/**
 * Matches on the bank details rather than the provider's recipient code:
 * Paystack mints a fresh recipient code every time it is asked, so the code is
 * not stable enough to deduplicate on.
 */
export const findPayoutAccountByDetails = async (
	prisma: Client,
	storeId: string,
	identity: PayoutAccountIdentity
) => {
	return prisma.storePayoutAccount.findUnique({
		where: {
			storeId_provider_bankCode_accountNumber: {
				storeId,
				provider: identity.provider,
				bankCode: identity.bankCode,
				accountNumber: identity.accountNumber
			}
		}
	});
};

export const createPayoutAccount = async (
	tx: TransactionClient,
	params: CreatePayoutAccountParams
) => {
	const { label, isDefault, ...rest } = params;

	if (isDefault) {
		await clearDefaultPayoutAccount(tx, params.storeId);
	}

	return tx.storePayoutAccount.create({
		data: {
			...rest,
			...(label ? { label } : {}),
			isDefault,
			status: PayoutAccountStatus.Active,
			verifiedAt: new Date()
		}
	});
};

/**
 * Brings a previously removed account back rather than inserting a duplicate,
 * which the `(storeId, provider, bankCode, accountNumber)` unique index would
 * reject anyway. The recipient code is refreshed because the old one may have
 * been deactivated at the provider in the meantime.
 */
export const reactivatePayoutAccount = async (
	tx: TransactionClient,
	id: string,
	params: {
		recipientRef: string;
		accountName: string;
		bankName: string;
		isDefault: boolean;
	}
) => {
	if (params.isDefault) {
		const existing = await tx.storePayoutAccount.findUniqueOrThrow({
			where: { id },
			select: { storeId: true }
		});

		await clearDefaultPayoutAccount(tx, existing.storeId);
	}

	return tx.storePayoutAccount.update({
		where: { id },
		data: {
			recipientRef: params.recipientRef,
			accountName: params.accountName,
			bankName: params.bankName,
			isDefault: params.isDefault,
			status: PayoutAccountStatus.Active,
			verifiedAt: new Date(),
			deactivatedAt: null
		}
	});
};

/**
 * Must run before the row that is becoming the default is written. The partial
 * unique index backing "one active default per store" cannot be deferred, so
 * setting the new default first collides with the outgoing one.
 */
export const clearDefaultPayoutAccount = async (
	tx: TransactionClient,
	storeId: string
) => {
	await tx.storePayoutAccount.updateMany({
		where: { storeId, isDefault: true },
		data: { isDefault: false }
	});
};

export const setDefaultPayoutAccount = async (
	tx: TransactionClient,
	storeId: string,
	id: string
) => {
	await clearDefaultPayoutAccount(tx, storeId);

	return tx.storePayoutAccount.update({
		where: { id },
		data: { isDefault: true }
	});
};

export const deactivatePayoutAccount = async (
	tx: TransactionClient,
	id: string
) => {
	return tx.storePayoutAccount.update({
		where: { id },
		data: {
			status: PayoutAccountStatus.Inactive,
			isDefault: false,
			deactivatedAt: new Date()
		}
	});
};

export const getNextDefaultCandidate = async (
	tx: TransactionClient,
	storeId: string,
	excludeId: string
) => {
	return tx.storePayoutAccount.findFirst({
		where: {
			storeId,
			status: PayoutAccountStatus.Active,
			id: { not: excludeId }
		},
		orderBy: { createdAt: 'asc' }
	});
};

export const countProcessingPayouts = async (prisma: Client, id: string) => {
	return prisma.payoutRequest.count({
		where: { payoutAccountId: id, status: PayoutStatus.Processing }
	});
};

/** Store-wide variant, for replacing whichever account is currently attached. */
export const countProcessingPayoutsForStore = async (
	prisma: Client,
	storeId: string
) => {
	return prisma.payoutRequest.count({
		where: { storeId, status: PayoutStatus.Processing }
	});
};

/**
 * Detaches every account a store currently has, so a replacement can take
 * their place in the same transaction. The rows survive as `Inactive`, which
 * is what keeps past payouts resolvable.
 */
export const deactivateActivePayoutAccounts = async (
	tx: TransactionClient,
	storeId: string
) => {
	await tx.storePayoutAccount.updateMany({
		where: { storeId, status: PayoutAccountStatus.Active },
		data: {
			status: PayoutAccountStatus.Inactive,
			isDefault: false,
			deactivatedAt: new Date()
		}
	});
};
