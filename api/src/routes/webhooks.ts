import { createHmac } from 'crypto';
import { Router } from 'express';

import { storeCard } from '../utils/paystack';
import {
	handleTransferFailure,
	handleTransferSuccess
} from '../utils/webhooks';

const webhookRouter: Router = Router();

webhookRouter.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash === req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		// TODO: Defer these actions. Push them to a queue and handle them
		// separately, to ensure that we can respond to Paystack quickly.

		if (event === 'charge.success') {
			await storeCard(data);
		} else if (event === 'transfer.success') {
			handleTransferSuccess(data);
		} else if (event === 'transfer.failure') {
			handleTransferFailure(data);
		}

		return res.status(200).json({
			success: true,
			data: { message: 'Done.' }
		});
	} else {
		return res.status(400).json({
			success: false,
			data: {
				message: 'This message did not originate from Paystack'
			}
		});
	}
});

export default webhookRouter;
