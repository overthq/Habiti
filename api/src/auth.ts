import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import redisClient from './config/redis';
import { sendVerificationCode } from './utils/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/authenticate', async (req, res) => {
	const { phone } = req.body;

	// Verify that user exists.
	await sendVerificationCode(phone);

	return res.status(200).json({
		success: true,
		data: {
			message: 'Account successfully created'
		}
	});
});

router.post('/register', async (req, res) => {
	const { name, phone } = req.body;

	const user = await prisma.user.create({
		data: {
			name,
			phone
		}
	});

	return res.status(201).json({
		success: true,
		data: { user }
	});
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

		// TODO: Sign user data to generate JWT.
		res.status(200).json({
			success: true,
			data: { user }
		});
	} else {
		res.status(400).json({
			success: false,
			data: {
				message: 'Invalid code'
			}
		});
	}
});

export default router;
