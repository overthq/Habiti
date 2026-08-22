import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import { PayoutAccountStatus } from '../../generated/prisma/client';
import * as PayoutAccountData from '../data/payoutAccounts';
import { PAYSTACK_PROVIDER } from '../data/payoutAccounts';
import { createTransferRecipient, resolveAccountNumber } from '../payments';
import { runSerializable } from '../../utils/prisma';
import { assertStoreScope } from './permissions';
import { LogicError, LogicErrorCode } from './errors';

export const MAX_PAYOUT_ACCOUNTS_PER_STORE = 1;

export interface PayoutAccountView {
	id: string;
	accountNumber: string;
	accountName: string | null;
	bankCode: string;
	bankName: string | null;
	label: string | null;
	isDefault: boolean;
	createdAt: Date;
}

interface PayoutAccountRow extends PayoutAccountView {
	recipientRef: string;
	status: PayoutAccountStatus;
}

export const toPayoutAccountView = (
	account: PayoutAccountRow
): PayoutAccountView => ({
	id: account.id,
	accountNumber: account.accountNumber,
	accountName: account.accountName,
	bankCode: account.bankCode,
	bankName: account.bankName,
	label: account.label,
	isDefault: account.isDefault,
	createdAt: account.createdAt
});

export const listPayoutAccounts = async (c: Context<AppEnv>) => {
	const { storeId } = assertStoreScope(c);

	const accounts = await PayoutAccountData.listPayoutAccounts(
		c.var.prisma,
		storeId
	);

	return accounts.map(toPayoutAccountView);
};

interface AddPayoutAccountInput {
	accountNumber: string;
	bankCode: string;
	label?: string | undefined;
	/**
	 * Detach the store's current account(s) and put this one in their place.
	 */
	replaceExisting?: boolean | undefined;
}

export const addPayoutAccount = async (
	c: Context<AppEnv>,
	input: AddPayoutAccountInput
) => {
	const { storeId } = assertStoreScope(c);

	const resolved = await resolveAccountNumber({
		accountNumber: input.accountNumber,
		bankCode: input.bankCode
	}).catch(() => null);

	if (!resolved?.status || !resolved.data?.account_number) {
		throw new LogicError(LogicErrorCode.BankAccountVerificationFailed);
	}

	const accountName: string = resolved.data.account_name;
	const accountNumber: string = resolved.data.account_number;

	const existing = await PayoutAccountData.findPayoutAccountByDetails(
		c.var.prisma,
		storeId,
		{ provider: PAYSTACK_PROVIDER, bankCode: input.bankCode, accountNumber }
	);

	if (existing && existing.status === PayoutAccountStatus.Active) {
		return toPayoutAccountView(existing);
	}

	const activeCount = await PayoutAccountData.countActivePayoutAccounts(
		c.var.prisma,
		storeId
	);

	let replacing = false;

	if (activeCount >= MAX_PAYOUT_ACCOUNTS_PER_STORE) {
		if (!input.replaceExisting) {
			throw new LogicError(LogicErrorCode.PayoutAccountLimitReached);
		}

		// Ensure there are no pending payouts.
		const inFlight = await PayoutAccountData.countProcessingPayoutsForStore(
			c.var.prisma,
			storeId
		);

		if (inFlight > 0) {
			throw new LogicError(LogicErrorCode.PayoutAccountInUse);
		}

		replacing = true;
	}

	const recipient = await createTransferRecipient({
		name: accountName,
		accountNumber,
		bankCode: input.bankCode
	}).catch(() => null);

	if (!recipient?.status || !recipient.data?.recipient_code) {
		throw new LogicError(LogicErrorCode.BankAccountVerificationFailed);
	}

	const details = recipient.data.details;

	const account = await runSerializable(c.var.prisma, async tx => {
		// Detaching inside the same transaction as the insert means a store is
		// never briefly left with no payout destination.
		if (replacing) {
			await PayoutAccountData.deactivateActivePayoutAccounts(tx, storeId);
		}

		const remaining = await PayoutAccountData.countActivePayoutAccounts(
			tx,
			storeId
		);

		const isDefault = remaining === 0;

		if (existing) {
			return PayoutAccountData.reactivatePayoutAccount(tx, existing.id, {
				recipientRef: recipient.data.recipient_code,
				accountName: details.account_name,
				bankName: details.bank_name,
				isDefault
			});
		}

		return PayoutAccountData.createPayoutAccount(tx, {
			storeId,
			provider: PAYSTACK_PROVIDER,
			accountNumber: details.account_number,
			bankCode: details.bank_code,
			accountName: details.account_name,
			bankName: details.bank_name,
			recipientRef: recipient.data.recipient_code,
			label: input.label,
			isDefault
		});
	});

	c.var.services.analytics.track({
		event: 'payout_account_added',
		distinctId: c.var.auth!.id,
		properties: {
			storeId,
			payoutAccountId: account.id,
			bankCode: account.bankCode,
			reactivated: !!existing,
			replacedExisting: replacing
		},
		groups: { store: storeId }
	});

	return toPayoutAccountView(account);
};

export const setDefaultPayoutAccount = async (
	c: Context<AppEnv>,
	payoutAccountId: string
) => {
	const { storeId } = assertStoreScope(c);

	const account = await PayoutAccountData.getPayoutAccountById(
		c.var.prisma,
		storeId,
		payoutAccountId
	);

	if (!account || account.status !== PayoutAccountStatus.Active) {
		throw new LogicError(LogicErrorCode.PayoutAccountNotFound);
	}

	if (account.isDefault) return toPayoutAccountView(account);

	const updated = await runSerializable(c.var.prisma, tx =>
		PayoutAccountData.setDefaultPayoutAccount(tx, storeId, account.id)
	);

	return toPayoutAccountView(updated);
};

export const removePayoutAccount = async (
	c: Context<AppEnv>,
	payoutAccountId: string
) => {
	const { storeId } = assertStoreScope(c);

	const account = await PayoutAccountData.getPayoutAccountById(
		c.var.prisma,
		storeId,
		payoutAccountId
	);

	if (!account || account.status !== PayoutAccountStatus.Active) {
		throw new LogicError(LogicErrorCode.PayoutAccountNotFound);
	}

	const inFlight = await PayoutAccountData.countProcessingPayouts(
		c.var.prisma,
		account.id
	);

	if (inFlight > 0) {
		throw new LogicError(LogicErrorCode.PayoutAccountInUse);
	}

	await runSerializable(c.var.prisma, async tx => {
		await PayoutAccountData.deactivatePayoutAccount(tx, account.id);

		if (account.isDefault) {
			const next = await PayoutAccountData.getNextDefaultCandidate(
				tx,
				storeId,
				account.id
			);

			if (next) {
				await PayoutAccountData.setDefaultPayoutAccount(tx, storeId, next.id);
			}
		}
	});

	c.var.services.analytics.track({
		event: 'payout_account_removed',
		distinctId: c.var.auth!.id,
		properties: { storeId, payoutAccountId: account.id },
		groups: { store: storeId }
	});

	return { id: account.id };
};

export const resolvePayoutAccount = async (
	c: Context<AppEnv>,
	storeId: string,
	payoutAccountId?: string | undefined
) => {
	if (payoutAccountId) {
		const account = await PayoutAccountData.getPayoutAccountById(
			c.var.prisma,
			storeId,
			payoutAccountId
		);

		if (!account || account.status !== PayoutAccountStatus.Active) {
			throw new LogicError(LogicErrorCode.PayoutAccountNotFound);
		}

		return account;
	}

	const account = await PayoutAccountData.getDefaultPayoutAccount(
		c.var.prisma,
		storeId
	);

	if (!account) {
		throw new LogicError(LogicErrorCode.NoAccountDetails);
	}

	return account;
};
