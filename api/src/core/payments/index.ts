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

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const data = await Paystack.chargeAuthorization({
		...options,
		...(options.metadata && { metadata: options.metadata })
	});

	return data;
};

export const initialCharge = async (options: InitialChargeOptions) => {
	const data = await Paystack.initializeTransaction({
		email: options.email,
		amount: options.amount,
		...(options.orderId && { metadata: { orderId: options.orderId } })
	});

	return data;
};

export const payAccount = async (options: PayAccountOptions) => {
	const data = await Paystack.transfer({
		amount: options.amount,
		reference: options.reference,
		recipient: options.recipient,
		...(options.metadata && { metadata: options.metadata })
	});

	return data;
};

export const verifyTransfer = async (options: VerifyTransferOptions) => {
	const data = await Paystack.verifyTransfer(options.transferId);
	return data;
};

export const finalizeTransfer = async (options: FinalizeTransferOptions) => {
	const data = await Paystack.finalizeTransfer(options);
	return data;
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
	const data = await Paystack.verifyTransaction(reference);
	return data;
};
