import { OrderStatus } from '@prisma/client';
import { Resolver } from '../../types/resolvers';
import { initialCharge } from '../../core/payments';

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.card.findUnique({ where: { id: parent.id } }).user();
};

export interface CardAuthorizationArgs {
	orderId?: string;
}

const cardAuthorization: Resolver<CardAuthorizationArgs> = async (
	_,
	{ orderId },
	ctx
) => {
	// Default to least amount possible.
	let amount = 5000;

	if (orderId) {
		const order = await ctx.prisma.order.findUnique({
			where: { id: orderId }
		});

		if (!order) {
			throw new Error('Order not found');
		} else if (order.status !== OrderStatus.PaymentPending) {
			throw new Error('Order is not in payment pending state');
		}

		amount = order.total;
	}

	const { data } = await initialCharge({
		email: ctx.user.email,
		amount,
		orderId
	});

	return { id: data.access_code, ...data };
};

export default {
	Query: {
		cardAuthorization
	},
	Card: {
		user
	}
};
