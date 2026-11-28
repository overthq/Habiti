import {
	authorizeUserCard,
	createUserOrder,
	getUserOrder,
	OrderStatus,
	type CreateOrderBody
} from '@habiti/data';

import env from '@/lib/env';
import { pollUntil } from '@/lib/poll';

type CheckoutSession = { access_code: string; authorization_url: string };

export const openPaystackPopup = async (session: CheckoutSession) => {
	// The fake Paystack has no inline script, only a hosted checkout page.
	if (env.paystackHostedCheckout) {
		window.open(session.authorization_url, 'paystack-checkout', 'popup');
		return;
	}

	// @ts-ignore
	const Paystack = (await import('@paystack/inline-js')).default;
	const popup = new Paystack();

	popup.resumeTransaction(session.access_code);
};

export const createOrderWithPayment = async (body: CreateOrderBody) => {
	const data = await createUserOrder(body);

	if (data.cardAuthorizationData) {
		openPaystackPopup(data.cardAuthorizationData);
		await pollUntil(
			() => getUserOrder(data.order.id),
			result => result.order.status !== OrderStatus.PaymentPending
		);
	}

	return data;
};

export const completeOrderPayment = async (orderId: string) => {
	const data = await authorizeUserCard(orderId);
	openPaystackPopup(data);

	return pollUntil(
		() => getUserOrder(orderId),
		result => result.order.status !== OrderStatus.PaymentPending
	);
};
