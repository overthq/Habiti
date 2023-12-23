import { Router } from 'express';
import { createHmac } from 'crypto';
import { storeCard } from './utils/paystack';
import { handleTransferFailure, handleTransferSuccess } from './utils/webhooks';

const router: Router = Router();

router.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash === req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		if (event === 'charge.success') {
			// FIXME: req.auth.id cannot be populated with the user id,
			// as this request is originating from Paystack.
			await storeCard((req as any).auth.id, data);
		} else if (event === 'transfer.success') {
			handleTransferSuccess(data);
		} else if (event === 'transfer.failure') {
			handleTransferFailure(data);
		}

		return res.status(200).json({
			success: true,
			data: { message: 'Done.' }
		});
	}
});

export default router;
