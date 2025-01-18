import argon2 from 'argon2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import { generateAccessToken } from '../utils/auth';

export default class AuthController {
	public async register(req: Request, res: Response) {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			throw new Error('Name, email, and password are required.');
		}

		if (password.length < 8) {
			throw new Error('Password must be at least 8 characters long.');
		}

		if (!email.includes('@')) {
			throw new Error('Please provide a valid email address.');
		}

		const passwordHash = await argon2.hash(password);

		const user = await prismaClient.user.create({
			data: { name, email, passwordHash }
		});

		return res.status(201).json({ user });
	}

	public async login(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new Error('Email and password are required.');
		}

		const user = await prismaClient.user.findUnique({ where: { email } });

		if (!user) {
			throw new Error('The specified user does not exist.');
		}

		const correct = await argon2.verify(user.passwordHash, password);

		if (!correct) {
			throw new Error('The entered password is incorrect');
		}

		const accessToken = await generateAccessToken(user);

		return res.status(200).json({ accessToken, userId: user.id });
	}

	public async verify(req: Request, res: Response) {
		const { email, code } = req.body;

		if (!email || !code) {
			throw new Error('Email and verification code are required.');
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
	}

	public async appleCallback(req: Request, res: Response) {
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

			// Check if user exists
			let user = await prismaClient.user.findUnique({
				where: { email: decodedToken.email }
			});

			if (!user) {
				// Create new user if they don't exist
				user = await prismaClient.user.create({
					data: {
						email: decodedToken.email,
						name: decodedToken.name || '',
						passwordHash: ''
					}
				});
			}

			// Generate JWT token
			const token = jwt.sign(user, process.env.JWT_SECRET as string);

			return res.status(200).json({ userId: user.id, token });
		} catch (error) {
			return res.status(500).json({
				message: error.message
			});
		}
	}
}
