import { Router } from 'express';
import redisClient from './config/redis';

const router = Router();

router.post('/authenticate', async (req, res) => {
	const { phone } = req.body;

	console.log(phone);

	return res.status(200).json({
		success: true,
		data: {
			message: ''
		}
	});
});

router.post('/register', async () => {});

router.post('/verify', async (req, res) => {
	const { phone, code } = req.body;

	const cachedCode = await redisClient.get(phone);

	if (cachedCode === code) {
	}
});

export default router;
