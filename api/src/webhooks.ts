import { Router } from 'express';
import { createHmac } from 'crypto';
import { User } from '@prisma/client';
import { storeCard } from './utils/paystack';

const router = Router();

router.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash === req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		if (event === 'charge.success') {
			// It's sad that we have to do this every time,
			// since we only this for the initial (tokenization) charge.
			// Maybe we can switch to using the Verify Transaction API
			// using a setTimeout?
			// Seems hacky, especially since we'd be estimating the
			// reasonable time it takes Paystack to complete the charge.
			// Still an option though.

			await storeCard((req.user as User).id, data);
		}

		return res.status(200).json({
			success: true,
			data: {
				message: 'Done.'
			}
		});
	}
});

export default router;
