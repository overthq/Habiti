import prismaClient from '../../config/prisma';
import { PrismaClient } from '@prisma/client';

interface CreateCardParams {
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
	userId: string;
}

interface StoreCardData {
	customer: { email: string };
	authorization: {
		signature: string;
		authorization_code: string;
		bin: string;
		last4: string;
		exp_month: string;
		exp_year: string;
		bank: string;
		card_type: string;
		country_code: string;
	};
}

export const storeCard = async (data: StoreCardData) => {
	return prismaClient.card.upsert({
		where: { signature: data.authorization.signature },
		update: {},
		create: {
			email: data.customer.email,
			authorizationCode: data.authorization.authorization_code,
			bin: data.authorization.bin,
			last4: data.authorization.last4,
			expMonth: data.authorization.exp_month,
			expYear: data.authorization.exp_year,
			bank: data.authorization.bank,
			signature: data.authorization.signature,
			cardType: data.authorization.card_type,
			countryCode: data.authorization.country_code,
			user: { connect: { email: data.customer.email } }
		}
	});
};

export const createCard = async (
	prisma: PrismaClient,
	params: CreateCardParams
) => {
	const card = await prisma.card.create({
		data: params
	});

	return card;
};

export const getCardsByUserId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const cards = await prisma.card.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});

	return cards;
};

export const getCardById = async (prisma: PrismaClient, cardId: string) => {
	const card = await prisma.card.findUnique({
		where: { id: cardId }
	});

	return card;
};

export const deleteCard = async (prisma: PrismaClient, cardId: string) => {
	await prisma.card.delete({
		where: { id: cardId }
	});
};

export const getCardBySignature = async (
	prisma: PrismaClient,
	signature: string
) => {
	const card = await prisma.card.findUnique({
		where: { signature }
	});

	return card;
};
