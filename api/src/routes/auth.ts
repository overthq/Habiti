import { Router } from 'express';
import jwt from 'jsonwebtoken';

import prismaClient from '../config/prisma';

const authRouter: Router = Router();

authRouter.post('/register', async () => {});

authRouter.post('/login', async () => {});

authRouter.post('/verify', async () => {});

authRouter.post('/apple-callback', async (req, res) => {
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
});

export default authRouter;
