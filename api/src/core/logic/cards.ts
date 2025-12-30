import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import { AppContext } from '../../utils/context';
import { initialCharge } from '../payments';
import { OrderStatus } from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from './errors';

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
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (input.email !== ctx.user.email) {
		throw new LogicError(LogicErrorCode.Forbidden);
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
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (input.email !== ctx.user.email) {
		throw new LogicError(LogicErrorCode.Forbidden);
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
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	let amount = 5000;

	if (input.orderId) {
		const order = await OrderData.getOrderById(ctx.prisma, input.orderId);

		if (!order) {
			throw new LogicError(LogicErrorCode.OrderNotFound);
		} else if (order.status !== OrderStatus.PaymentPending) {
			throw new LogicError(LogicErrorCode.OrderNotPayable);
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
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return CardData.getCardsByUserId(ctx.prisma, userId);
};

export const getCardById = async (ctx: AppContext, cardId: string) => {
	const card = await CardData.getCardById(ctx.prisma, cardId);

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!card) {
		throw new LogicError(LogicErrorCode.CardNotFound);
	}

	if (card.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return card;
};

interface DeleteCardInput {
	cardId: string;
}

export const deleteCard = async (ctx: AppContext, input: DeleteCardInput) => {
	const { cardId } = input;

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const card = await CardData.getCardById(ctx.prisma, cardId);

	if (!card) {
		throw new LogicError(LogicErrorCode.CardNotFound);
	}

	if (card.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
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
