import { PayoutStatus } from '../../generated/prisma/client';
import { AppContext } from '../../utils/context';

// `body` here comes directly from Paystack.
export const approvePayment = async (ctx: AppContext, body: any) => {
	const { reference, amount } = extractParameters(body);

	const payout = await ctx.prisma.payout.findUnique({
		where: {
			id: reference,
			status: PayoutStatus.Pending,
			amount
		}
	});

	return payout;
};

// It's currently hard to know what the shape of the information from Paystack
// looks like here, so I'm checking all the _reasonable_ places.
// It would be good to be sure where this information should be, so we can
// validate with Zod, but this should work for now.

const extractParameters = (body: any) => {
	const reference = body?.reference || body?.data?.reference;
	const amount = body?.amount || body?.data?.amount;

	if (!reference) {
		throw new Error('Unable to extract reference parameter');
	} else if (!amount) {
		throw new Error('Unable to extract amount parameter');
	}

	return { reference, amount: Number(amount) };
};
