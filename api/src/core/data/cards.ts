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

export const storeCard = async (data: StoreCardData) => {
	return await prismaClient.card.upsert({
		where: {
			signature: data.signature,
			user: { email: data.email }
		},
		update: {},
		create: {
			email: data.email,
			authorizationCode: data.authorizationCode,
			bin: data.bin,
			last4: data.last4,
			expMonth: data.expMonth,
			expYear: data.expYear,
			bank: data.bank,
			signature: data.signature,
			cardType: data.cardType,
			countryCode: data.countryCode,
			user: { connect: { email: data.email } }
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
