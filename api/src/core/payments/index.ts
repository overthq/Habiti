import { storeCard } from '../data/cards';
import {
	ChargeAuthorizationOptions,
	CreateTransferReceipientOptions,
	InitialChargeOptions,
	PayAccountOptions,
	ResolveAccountNumberOptions,
	VerifyTransferOptions
} from './types';
import * as Paystack from './paystack';
import { transitionOrderToPending } from './webhooks';

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const data = await Paystack.chargeAuthorization(options);

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
	return await Paystack.transfer({
		amount: options.amount,
		reference: options.reference,
		recipient: options.recipient,
		...(options.metadata && { metadata: options.metadata })
	});
};

export const verifyTransfer = async (options: VerifyTransferOptions) => {
	return await Paystack.verifyTransfer(options.transferId);
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
		const card = await storeCard({
			email: data.customer.email,
			signature: data.authorization.signature,
			authorizationCode: data.authorization.authorization_code,
			bin: data.authorization.bin,
			last4: data.authorization.last4,
			expMonth: data.authorization.exp_month,
			expYear: data.authorization.exp_year,
			bank: data.authorization.bank,
			cardType: data.authorization.card_type,
			countryCode: data.authorization.country_code
		});

		if (typeof data.metadata === 'object' && data.metadata?.orderId) {
			console.log('Transitioning order to pending', data.metadata.orderId);

			await transitionOrderToPending(data.metadata.orderId);
		}

		return card;
	}
};
