import { createHmac } from 'crypto';
import { Router } from 'express';

import { handlePaystackWebhookEvent } from '../core/payments/webhooks';
import { env } from '../config/env';

const webhookRouter: Router = Router();

webhookRouter.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash === req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		Promise.resolve().then(async () => {
			handlePaystackWebhookEvent(event, data);
		});

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
