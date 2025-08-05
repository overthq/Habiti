import { Router } from 'express';

import {
	approvePayment,
	verifyTransaction,
	verifyTransfer
} from '../core/payments';

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
		const payout = await approvePayment(body);

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

export default paymentsRouter;
