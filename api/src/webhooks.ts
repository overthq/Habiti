import { Router } from 'express';
import { createHmac } from 'crypto';

const router = Router();

router.post('/paystack', (req, res) => {
	const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex');

	if (hash == req.headers['x-paystack-signature']) {
		const { event, data } = req.body;
		if (event === 'charge.success') {
			console.log(data);
		}
	}

	return res.status(200).json({
		success: true,
		data: {
			message: 'Done.'
		}
	});
});

export default router;
