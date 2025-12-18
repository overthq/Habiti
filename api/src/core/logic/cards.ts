import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import { AppContext } from '../../utils/context';
import { initialCharge } from '../payments';
import { OrderStatus } from '../../generated/prisma/client';

interface StoreCardInput {
	email: string;
	signature: string;
	authorizationCode: string;
	bin: string;
	last4: string;
	expMonth: string;
	expYear: string;
	bank: string;
	cardType: string;
	countryCode: string;
}
export const storeCard = async (ctx: AppContext, input: StoreCardInput) => {
	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (input.email !== ctx.user.email) {
		throw new Error('Unauthorized: Email does not match current user');
	}

	const card = await CardData.storeCard(input);

	ctx.services.analytics.track({
		event: 'card_stored',
		distinctId: ctx.user.id,
		properties: {
			cardId: card.id,
			bank: card.bank,
			cardType: card.cardType,
			countryCode: card.countryCode,
			last4: card.last4
		}
	});

	return card;
};

interface CreateCardInput {
	email: string;
	authorizationCode: string;
	bin: string;
	last4: string;
	expMonth: string;
	expYear: string;
	bank: string;
	signature: string;
	cardType: string;
	countryCode: string;
}

export const createCard = async (ctx: AppContext, input: CreateCardInput) => {
	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (input.email !== ctx.user.email) {
		throw new Error('Unauthorized: Email does not match current user');
	}

	const card = await CardData.createCard(ctx.prisma, {
		...input,
		userId: ctx.user.id
	});

	ctx.services.analytics.track({
		event: 'card_created',
		distinctId: ctx.user.id,
		properties: {
			cardId: card.id,
			bank: card.bank,
			cardType: card.cardType,
			countryCode: card.countryCode,
			last4: card.last4
		}
	});

	return card;
};

interface AuthorizeCardInput {
	orderId?: string | undefined;
}

export const authorizeCard = async (
	ctx: AppContext,
	input: AuthorizeCardInput
) => {
	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	let amount = 5000;

	if (input.orderId) {
		const order = await OrderData.getOrderById(ctx.prisma, input.orderId);

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
		orderId: input.orderId
	});

	return { id: data.access_code, ...data };
};

export const getCardsByUserId = async (ctx: AppContext, userId: string) => {
	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's cards");
	}

	return CardData.getCardsByUserId(ctx.prisma, userId);
};

export const getCardById = async (ctx: AppContext, cardId: string) => {
	const card = await CardData.getCardById(ctx.prisma, cardId);

	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (!card) {
		throw new Error('Card not found');
	}

	if (card.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Card does not belong to current user');
	}

	return card;
};

interface DeleteCardInput {
	cardId: string;
}

export const deleteCard = async (ctx: AppContext, input: DeleteCardInput) => {
	const { cardId } = input;

	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	const card = await CardData.getCardById(ctx.prisma, cardId);

	if (!card) {
		throw new Error('Card not found');
	}

	if (card.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Card does not belong to current user');
	}

	await CardData.deleteCard(ctx.prisma, cardId);

	ctx.services.analytics.track({
		event: 'card_deleted',
		distinctId: ctx.user.id,
		properties: {
			cardId: card.id,
			bank: card.bank,
			cardType: card.cardType,
			last4: card.last4
		}
	});

	return card;
};
