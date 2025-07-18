import { Router } from 'express';

import { verifyTransaction } from '../core/payments';

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

export default paymentsRouter;
