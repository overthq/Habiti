import prismaClient from '../../config/prisma';

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
