import { createHmac } from 'crypto';
import { Router } from 'express';

import { handlePaystackWebhookEvent } from '../core/payments/webhooks';

const webhookRouter: Router = Router();

webhookRouter.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash === req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		// Process webhook actions in the background
		Promise.resolve().then(async () => {
			handlePaystackWebhookEvent(event, data);
		});

		// Respond immediately
		return res.status(200).json({
			success: true,
			data: { message: 'Webhook received and processing.' }
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
