import { Router } from 'express';
import { PayoutStatus } from '@prisma/client';

import { verifyTransaction, verifyTransfer } from '../core/payments';
import prismaClient from '../config/prisma';

const paymentsRouter: Router = Router();

paymentsRouter.post('/verify-transaction', async (req, res) => {
	const { reference } = req.body;

	try {
		const data = await verifyTransaction(reference);

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
});

paymentsRouter.post('/verify-transfer', async (req, res) => {
	const { transferId } = req.body;

	try {
		const data = await verifyTransfer({ transferId });

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
});

// IMPORTANT: We have to ensure that this action stays as fast as possible.
// Any latency in our DB calls here will cause the payout to fail.

paymentsRouter.post('/approve-payment', async (req, res) => {
	const { body } = req;

	try {
		const { reference, amount } = extractParameters(body);

		const payout = await prismaClient.payout.findUnique({
			where: {
				id: reference,
				status: PayoutStatus.Pending,
				amount
			}
		});

		if (!payout) {
			return res.status(400).json({
				success: false,
				message: 'Payout not found or has already been resolved'
			});
		}

		return res.status(200).json({ sucess: true, message: 'Payment approved' });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
});

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

export default paymentsRouter;
