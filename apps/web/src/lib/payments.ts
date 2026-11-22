import {
	authorizeUserCard,
	createUserOrder,
	getUserOrder,
	OrderStatus,
	type CreateOrderBody
} from '@habiti/data';

import { pollUntil } from '@/lib/poll';

export const openPaystackPopup = async (accessCode: string) => {
	// @ts-ignore
	const Paystack = (await import('@paystack/inline-js')).default;
	const popup = new Paystack();

	popup.resumeTransaction(accessCode);
};

export const createOrderWithPayment = async (body: CreateOrderBody) => {
	const data = await createUserOrder(body);

	if (data.cardAuthorizationData) {
		openPaystackPopup(data.cardAuthorizationData.access_code);
		await pollUntil(
			() => getUserOrder(data.order.id),
			result => result.order.status !== OrderStatus.PaymentPending
		);
	}

	return data;
};

export const completeOrderPayment = async (orderId: string) => {
	const data = await authorizeUserCard(orderId);
	openPaystackPopup(data.access_code);

	return pollUntil(
		() => getUserOrder(orderId),
		result => result.order.status !== OrderStatus.PaymentPending
	);
};
