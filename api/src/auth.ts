import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import redisClient from './config/redis';
import { generateAccessToken, sendVerificationCode } from './utils/auth';

const router: Router = Router();
const prisma = new PrismaClient();

router.post('/authenticate', async (req, res) => {
	const { phone } = req.body;

	const user = await prisma.user.findUnique({ where: { phone } });

	if (!user) {
		return res.status(404).json({
			success: false,
			data: {
				message: 'The specified user does not exist.'
			}
		});
	}

	await sendVerificationCode(phone);

	return res.status(200).json({
		success: true,
		data: {
			message: 'Authentication successful.'
		}
	});
});

router.post('/register', async (req, res) => {
	const { name, phone, email } = req.body;

	try {
		const user = await prisma.user.create({
			data: { name, phone, email }
		});

		return res.status(201).json({
			success: true,
			data: { user }
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			data: {
				message: 'An error occurred while registering user.',
				error
			}
		});
	}
});

router.post('/verify', async (req, res) => {
	const { phone, code } = req.body;

	const cachedCode = await redisClient.get(phone);

	if (!cachedCode) {
		return res.status(404).json({
			success: false,
			data: {
				message: 'No code found for user.'
			}
		});
	}

	if (cachedCode === code) {
		const user = await prisma.user.findUnique({
			where: { phone }
		});

		const accessToken = await generateAccessToken(user);

		return res.status(200).json({
			success: true,
			data: { accessToken, userId: user.id }
		});
	} else {
		return res.status(400).json({
			success: false,
			data: {
				message: 'Invalid code'
			}
		});
	}
});

export default router;
