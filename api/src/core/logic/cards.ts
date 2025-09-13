import * as CardData from '../data/cards';
import { AppContext } from '../../utils/context';

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

interface DeleteCardInput {
	cardId: string;
}

export const storeCard = async (ctx: AppContext, input: StoreCardInput) => {
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

export const createCard = async (ctx: AppContext, input: CreateCardInput) => {
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

export const getCardsByUserId = async (ctx: AppContext, userId: string) => {
	if (userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's cards");
	}

	return CardData.getCardsByUserId(ctx.prisma, userId);
};

export const getCardById = async (ctx: AppContext, cardId: string) => {
	const card = await CardData.getCardById(ctx.prisma, cardId);

	if (!card) {
		throw new Error('Card not found');
	}

	if (card.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Card does not belong to current user');
	}

	return card;
};

export const deleteCard = async (ctx: AppContext, input: DeleteCardInput) => {
	const { cardId } = input;

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
