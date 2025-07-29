import { Router } from 'express';

import { verifyTransaction, verifyTransfer } from '../core/payments';

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

export default paymentsRouter;
