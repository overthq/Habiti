import type { Context } from 'hono';

import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import * as PaymentLogic from './payments';

import type { AppEnv } from '../../types/hono';
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
export const storeCard = async (c: Context<AppEnv>, input: StoreCardInput) => {
	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (input.email !== c.var.auth.email) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const card = await CardData.storeCard(c.var.prisma, input);

	c.var.services.analytics.track({
		event: 'card_stored',
		distinctId: c.var.auth.id,
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

export const createCard = async (
	c: Context<AppEnv>,
	input: CreateCardInput
) => {
	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (input.email !== c.var.auth.email) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const card = await CardData.createCard(c.var.prisma, {
		...input,
		userId: c.var.auth.id
	});

	c.var.services.analytics.track({
		event: 'card_created',
		distinctId: c.var.auth.id,
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
	c: Context<AppEnv>,
	input: AuthorizeCardInput
) => {
	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	let amount = 5000;

	if (input.orderId) {
		const order = await OrderData.getOrderById(c.var.prisma, input.orderId);

		if (!order) {
			throw new LogicError(LogicErrorCode.OrderNotFound);
		} else if (order.status !== OrderStatus.PaymentPending) {
			throw new LogicError(LogicErrorCode.OrderNotPayable);
		}

		amount = order.total + order.transactionFee + order.serviceFee;
	}

	const { data } = await PaymentLogic.initialCharge(c, {
		email: c.var.auth.email,
		amount,
		orderId: input.orderId
	});

	return { id: data.access_code, ...data };
};

export const getCardsByUserId = async (c: Context<AppEnv>, userId: string) => {
	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return CardData.getCardsByUserId(c.var.prisma, userId);
};

export const getCardById = async (c: Context<AppEnv>, cardId: string) => {
	const card = await CardData.getCardById(c.var.prisma, cardId);

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!card) {
		throw new LogicError(LogicErrorCode.CardNotFound);
	}

	if (card.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return card;
};

interface DeleteCardInput {
	cardId: string;
}

export const deleteCard = async (
	c: Context<AppEnv>,
	input: DeleteCardInput
) => {
	const { cardId } = input;

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const card = await CardData.getCardById(c.var.prisma, cardId);

	if (!card) {
		throw new LogicError(LogicErrorCode.CardNotFound);
	}

	if (card.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	await CardData.deleteCard(c.var.prisma, cardId);

	c.var.services.analytics.track({
		event: 'card_deleted',
		distinctId: c.var.auth.id,
		properties: {
			cardId: card.id,
			bank: card.bank,
			cardType: card.cardType,
			last4: card.last4
		}
	});

	return card;
};
