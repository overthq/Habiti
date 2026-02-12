import {
	ChargeAuthorizationOptions,
	CreateTransferReceipientOptions,
	FinalizeTransferOptions,
	InitialChargeOptions,
	PayAccountOptions,
	ResolveAccountNumberOptions,
	VerifyTransferOptions
} from './types';

import * as Paystack from './paystack';

import * as PayoutData from '../data/payouts';

import { env } from '../../config/env';

import { processCardCharge } from '../logic/payments';
import { pollUntil } from '../../utils/poll';

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const data = await Paystack.chargeAuthorization(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 12
		});
	}

	return data;
};

export const initialCharge = async (options: InitialChargeOptions) => {
	const data = await Paystack.initializeTransaction({
		email: options.email,
		amount: options.amount,
		...(options.orderId && { metadata: { orderId: options.orderId } })
	});

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 24
		});
	}

	return data;
};

export const payAccount = async (options: PayAccountOptions) => {
	return await Paystack.transfer({
		amount: options.amount,
		reference: options.reference,
		recipient: options.recipient,
		...(options.metadata && { metadata: options.metadata })
	});
};

export const verifyTransfer = async (options: VerifyTransferOptions) => {
	const { data, status } = await Paystack.verifyTransfer(options.transferId);

	if (status === true && data.status === 'success') {
		await PayoutData.markPayoutAsSuccessful(options.transferId);
	} else {
		await PayoutData.markPayoutAsFailed(options.transferId);
	}

	return data;
};

export const finalizeTransfer = async (options: FinalizeTransferOptions) => {
	const { data, status } = await Paystack.finalizeTransfer(options);

	if (status === true && data.status === 'success') {
		await PayoutData.markPayoutAsSuccessful(options.transferCode);
	}
};

export const resolveAccountNumber = async (
	options: ResolveAccountNumberOptions
) => {
	return await Paystack.resolveAccountNumber(options);
};

export const createTransferReceipient = async (
	options: CreateTransferReceipientOptions
) => {
	return await Paystack.createTransferReceipient(options);
};

export const listBanks = async () => {
	return await Paystack.listBanks();
};

export const verifyTransaction = async (reference: string) => {
	const { data, status } = await Paystack.verifyTransaction(reference);

	if (status === true && data.status === 'success') {
		return await processCardCharge(data);
	}
};
