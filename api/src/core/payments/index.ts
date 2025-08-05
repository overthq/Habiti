import { storeCard } from '../data/cards';
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
import { transitionOrderToPending } from './webhooks';
import { markPayoutAsFailed, markPayoutAsSuccessful } from '../data/payouts';
import prismaClient from '../../config/prisma';
import { PayoutStatus } from '@prisma/client';

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
	const { data, status } = await Paystack.verifyTransfer(options.transferId);

	if (status === true && data.status === 'success') {
		await markPayoutAsSuccessful(options.transferId);
	} else {
		await markPayoutAsFailed(options.transferId);
	}

	return data;
};

export const finalizeTransfer = async (options: FinalizeTransferOptions) => {
	const { data, status } = await Paystack.finalizeTransfer(options);

	if (status === true && data.status === 'success') {
		await markPayoutAsSuccessful(options.transferCode);
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

// `body` here comes directly from Paystack.
export const approvePayment = async (body: any) => {
	const { reference, amount } = extractParameters(body);

	const payout = await prismaClient.payout.findUnique({
		where: {
			id: reference,
			status: PayoutStatus.Pending,
			amount
		}
	});

	return payout;
};

// It's currently hard to know what the shape of the information from Paystack
// looks like here, so I'm checking all the _reasonable_ places.
// It would be good to be sure where this information should be, so we can
// validate with Zod, but this should work for now.

const extractParameters = (body: any) => {
	const reference = body?.reference || body?.data?.reference;
	const amount = body?.amount || body?.data?.amount;

	if (!reference) {
		throw new Error('Unable to extract reference parameter');
	} else if (!amount) {
		throw new Error('Unable to extract amount parameter');
	}

	return { reference, amount: Number(amount) };
};
