import { Router } from 'express';

import { HabitiRequest } from '../types/misc';
import { verifyTransaction } from '../utils/paystack';

const paymentsRouter: Router = Router();

paymentsRouter.post('/verify-transaction', async (req: HabitiRequest, res) => {
	const { reference } = req.body;

	try {
		const data = await verifyTransaction(reference);

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
});

export default paymentsRouter;
