import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import { generateAccessToken } from '../utils/auth';
import { hashPassword, verifyPassword } from '../core/logic/auth';

export const register = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const passwordHash = await hashPassword(password);

	const user = await prismaClient.user.create({
		data: { name, email, passwordHash }
	});

	return res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await prismaClient.user.findUnique({ where: { email } });

	if (!user) {
		return res
			.status(401)
			.json({ error: 'The specified user does not exist.' });
	}

	const correct = await verifyPassword(password, user.passwordHash);

	if (!correct) {
		return res.status(401).json({ error: 'The entered password is incorrect' });
	}

	const accessToken = await generateAccessToken(user);

	return res.status(200).json({ accessToken, userId: user.id });
};

export const verify = async (req: Request, res: Response) => {
	const { email, code } = req.body;

	if (!email || !code) {
		return res
			.status(400)
			.json({ error: 'Email and verification code are required.' });
	}

	const cachedCode = await redisClient.get(email);

	if (!cachedCode) throw new Error('No code found for user.');

	if (cachedCode === code) {
		const user = await prismaClient.user.findUnique({ where: { email } });

		if (!user) {
			throw new Error('The specified user does not exist.');
		}

		const accessToken = await generateAccessToken(user);

		return res.status(200).json({ accessToken, userId: user.id });
	} else {
		return res.status(400).json({ error: 'Invalid code' });
	}
};

export const appleCallback = async (req: Request, res: Response) => {
	try {
		const response = await fetch('https://appleid.apple.com/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: process.env.APPLE_CLIENT_ID as string,
				client_secret: process.env.APPLE_CLIENT_SECRET as string,
				code: req.body.code,
				grant_type: 'authorization_code',
				redirect_uri: process.env.APPLE_REDIRECT_URI as string
			})
		});

		const data = await response.json();
		const decodedToken = jwt.decode(data.id_token) as any;

		if (!decodedToken?.email) {
			return res.status(400).json({
				message: 'Invalid Apple ID token'
			});
		}

		let user = await prismaClient.user.findUnique({
			where: { email: decodedToken.email }
		});

		if (!user) {
			user = await prismaClient.user.create({
				data: {
					email: decodedToken.email,
					name: decodedToken.name || '',
					passwordHash: ''
				}
			});
		}

		const accessToken = await generateAccessToken(user);

		return res.status(200).json({ accessToken, userId: user.id });
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};
