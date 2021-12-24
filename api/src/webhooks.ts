import { Router } from 'express';
import { createHmac } from 'crypto';
import { User } from '@prisma/client';
import { storeCard } from './utils/paystack';

const router = Router();

router.post('/paystack', async (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash == req.headers['x-paystack-signature']) {
		const { event, data } = req.body;

		if (event === 'charge.success') {
			await storeCard(req.user as User, data);
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
