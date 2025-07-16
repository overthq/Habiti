import { OrderStatus } from '@prisma/client';

import { storeCard } from '../data/cards';
import { markPayoutAsFailed, markPayoutAsSuccessful } from '../data/payouts';
import { getOrderById, updateOrder } from '../data/orders';
import prismaClient from '../../config/prisma';
import {
	ChargeSuccessPayload,
	isTransferCharge,
	TransferFailurePayload,
	TransferSuccessPayload
} from './validation';

const SUPPORTED_EVENTS = [
	'charge.success',
	'transfer.success',
	'transfer.failure',
	'transfer.reversed'
];

export const handlePaystackWebhookEvent = async (event: string, data: any) => {
	try {
		if (!SUPPORTED_EVENTS.includes(event)) {
			console.warn(`Unsupported event: ${event}`);
			return;
		}

		if (event === 'charge.success') {
			await handleChargeSuccess(data);
		} else if (event === 'transfer.success') {
			await handleTransferSuccess(data);
		} else if (event === 'transfer.failure') {
			await handleTransferFailure(data);
		}
	} catch (error) {
		console.error(error);
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (data: ChargeSuccessPayload) => {
	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return;
	} else {
		await storeCard({
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
	}
	// In both cases, we want to check if `orderId` is set in the metadata.

	if (typeof data.metadata === 'object' && data.metadata?.orderId) {
		await transitionOrderToPending(data.metadata.orderId);
	}
};

export const transitionOrderToPending = async (orderId: string) => {
	try {
		const order = await getOrderById(prismaClient, orderId);

		if (!order) {
			console.warn(`Order not found for charge: ${orderId}`);
		} else if (order.status !== OrderStatus.PaymentPending) {
			console.warn(
				`Order ${order.id} is not in the PaymentPending state. It is in the ${order.status} state.`
			);
		} else {
			await updateOrder(prismaClient, order.id, {
				status: OrderStatus.Pending
			});
		}
	} catch (error) {
		console.error(error);
	}
};

// {
//   "event": "transfer.success",
//   "data": {
//     "amount": 30000,
//     "currency": "NGN",
//     "domain": "test",
//     "failures": null,
//     "id": 37272792,
//     "integration": {
//       "id": 463433,
//       "is_live": true,
//       "business_name": "Boom Boom Industries NG"
//     },
//     "reason": "Have fun...",
//     "reference": "1jhbs3ozmen0k7y5efmw",
//     "source": "balance",
//     "source_details": null,
//     "status": "success",
//     "titan_code": null,
//     "transfer_code": "TRF_wpl1dem4967avzm",
//     "transferred_at": null,
//     "recipient": {
//       "active": true,
//       "currency": "NGN",
//       "description": "",
//       "domain": "test",
//       "email": null,
//       "id": 8690817,
//       "integration": 463433,
//       "metadata": null,
//       "name": "Jack Sparrow",
//       "recipient_code": "RCP_a8wkxiychzdzfgs",
//       "type": "nuban",
//       "is_deleted": false,
//       "details": {
//         "account_number": "0000000000",
//         "account_name": null,
//         "bank_code": "011",
//         "bank_name": "First Bank of Nigeria"
//       },
//       "created_at": "2020-09-03T12:11:25.000Z",
//       "updated_at": "2020-09-03T12:11:25.000Z"
//     },
//     "session": {
//       "provider": null,
//       "id": null
//     },
//     "created_at": "2020-10-26T12:28:57.000Z",
//     "updated_at": "2020-10-26T12:28:57.000Z"
//   }
// }

export const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	await markPayoutAsSuccessful(data.reference);
};

// {
//   "event": "transfer.failed",
//   "data": {
//     "amount": 200000,
//     "currency": "NGN",
//     "domain": "test",
//     "failures": null,
//     "id": 69123462,
//     "integration": {
//       "id": 100043,
//       "is_live": true,
//       "business_name": "Paystack"
//     },
//     "reason": "Enjoy",
//     "reference": "1976435206",
//     "source": "balance",
//     "source_details": null,
//     "status": "failed",
//     "titan_code": null,
//     "transfer_code": "TRF_chs98y5rykjb47w",
//     "transferred_at": null,
//     "recipient": {
//       "active": true,
//       "currency": "NGN",
//       "description": null,
//       "domain": "test",
//       "email": "test@email.com",
//       "id": 13584206,
//       "integration": 100043,
//       "metadata": null,
//       "name": "Ted Lasso",
//       "recipient_code": "RCP_cjcua8itre45gs",
//       "type": "nuban",
//       "is_deleted": false,
//       "details": {
//         "authorization_code": null,
//         "account_number": "0123456789",
//         "account_name": "Ted Lasso",
//         "bank_code": "011",
//         "bank_name": "First Bank of Nigeria"
//       },
//       "created_at": "2021-04-12T15:30:14.000Z",
//       "updated_at": "2021-04-12T15:30:14.000Z"
//     },
//     "session": {
//       "provider": "nip",
//       "id": "74849400998877667"
//     },
//     "created_at": "2021-04-12T15:30:15.000Z",
//     "updated_at": "2021-04-12T15:41:21.000Z"
//   }
// }

export const handleTransferFailure = async (data: TransferFailurePayload) => {
	await markPayoutAsFailed(data.reference);
};
