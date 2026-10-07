import { PrismaClient } from '../../generated/prisma/client';

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

export const storeCard = async (prisma: PrismaClient, data: StoreCardData) => {
	const user = await prisma.user.findUnique({
		where: { email: data.email }
	});

	if (!user) {
		throw new Error('User not found');
	}

	return prisma.card.upsert({
		where: {
			userId_signature: { userId: user.id, signature: data.signature }
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
