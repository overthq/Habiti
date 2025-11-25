import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import * as AuthLogic from '../core/logic/auth';
import * as UserLogic from '../core/logic/users';

import { env } from '../config/env';
import { getAppContext } from '../utils/context';

export const register = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.register(ctx, { name, email, password });

		return res.status(201).json({ user });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const ctx = getAppContext(req);

		const user = await UserLogic.getUserByEmail(ctx, email);

		if (!user) {
			return res
				.status(401)
				.json({ error: 'The specified user does not exist.' });
		}

		const correct = await AuthLogic.verifyPassword(password, user.passwordHash);

		if (!correct) {
			return res
				.status(401)
				.json({ error: 'The entered password is incorrect' });
		}

		const accessToken = await AuthLogic.generateAccessToken(user);
		const refreshToken = await AuthLogic.generateRefreshToken(ctx, user.id);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json({ accessToken, refreshToken, userId: user.id });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const verify = async (req: Request, res: Response) => {
	const { email, code } = req.body;

	if (!email || !code) {
		return res
			.status(400)
			.json({ error: 'Email and verification code are required.' });
	}

	const cachedCode = await AuthLogic.retrieveVerificationCode(email);

	if (!cachedCode) throw new Error('No code found for user.');

	if (cachedCode === code) {
		const ctx = getAppContext(req);
		const user = await UserLogic.getUserByEmail(ctx, email);

		if (!user) {
			throw new Error('The specified user does not exist.');
		}

		const accessToken = await AuthLogic.generateAccessToken(user);
		const refreshToken = await AuthLogic.generateRefreshToken(ctx, user.id);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json({ accessToken, refreshToken, userId: user.id });
	} else {
		return res.status(400).json({ error: 'Invalid code' });
	}
};

export const appleCallback = async (req: Request, res: Response) => {
	try {
		if (
			!env.APPLE_CLIENT_ID ||
			!env.APPLE_CLIENT_SECRET ||
			!env.APPLE_REDIRECT_URI
		) {
			throw new Error('Apple credentials not specified');
		}

		const response = await fetch('https://appleid.apple.com/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: env.APPLE_CLIENT_ID,
				client_secret: env.APPLE_CLIENT_SECRET,
				code: req.body.code,
				grant_type: 'authorization_code',
				redirect_uri: env.APPLE_REDIRECT_URI
			})
		});

		const data = await response.json();
		const decodedToken = jwt.decode(data.id_token) as any;

		if (!decodedToken?.email) {
			return res.status(400).json({
				message: 'Invalid Apple ID token'
			});
		}

		const ctx = getAppContext(req);

		let user = await UserLogic.getUserByEmail(ctx, decodedToken.email);

		if (!user) {
			user = await UserLogic.createUser(ctx, {
				name: decodedToken.name || '',
				email: decodedToken.email,
				passwordHash: ''
			});
		}

		const accessToken = await AuthLogic.generateAccessToken(user);
		const refreshToken = await AuthLogic.generateRefreshToken(ctx, user.id);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json({ accessToken, refreshToken, userId: user.id });
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const refresh = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (!refreshToken) {
		console.log('Refresh token required');
		return res.status(401).json({ error: 'Refresh token required' });
	}

	try {
		const ctx = getAppContext(req);
		const tokens = await AuthLogic.rotateRefreshToken(ctx, refreshToken);

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json(tokens);
	} catch (error) {
		console.log(error);
		console.log('Invalid refresh token');
		return res.status(401).json({ error: 'Invalid refresh token' });
	}
};

export const logout = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (refreshToken) {
		const ctx = getAppContext(req);
		await AuthLogic.revokeRefreshToken(ctx, refreshToken);
	}

	res.clearCookie('refreshToken', { path: '/' });
	return res.status(200).json({ message: 'Logged out' });
};
