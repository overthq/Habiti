import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as AuthLogic from '../core/logic/auth';
import * as UserLogic from '../core/logic/users';
import * as CartLogic from '../core/logic/carts';

import { env } from '../config/env';
import { getAppContext } from '../utils/context';
import { LogicError, LogicErrorCode } from '../core/logic/errors';
import type {
	RegisterBody,
	AuthenticateBody,
	VerifyCodeBody,
	AppleCallbackBody,
	RefreshBody,
	LogoutBody
} from '../core/validations/rest';

export const register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email } = req.body;
		const ctx = getAppContext(req);
		const user = await UserLogic.register(ctx, { name, email });
		return res.status(201).json({ user });
	} catch (error) {
		return next(error);
	}
};

export const login = async (
	req: Request<{}, {}, AuthenticateBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.body;
		const ctx = getAppContext(req);
		await UserLogic.login(ctx, { email });
		return res
			.status(200)
			.json({ message: 'Verification code sent to your email' });
	} catch (error) {
		return next(error);
	}
};

export const verify = async (
	req: Request<{}, {}, VerifyCodeBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, code, cartIds } = req.body;

		if (!email || !code) {
			return res
				.status(400)
				.json({ error: 'Email and verification code are required.' });
		}

		const cachedCode = await AuthLogic.retrieveVerificationCode(email);

		if (!cachedCode) {
			throw new LogicError(LogicErrorCode.NotFound);
		}

		if (cachedCode !== code) {
			return res.status(400).json({ error: 'Invalid code' });
		}

		const ctx = getAppContext(req);
		const user = await UserLogic.getUserByEmail(ctx, email);

		if (!user) {
			throw new LogicError(LogicErrorCode.UserNotFound);
		}

		const refreshResult = await AuthLogic.generateRefreshToken(
			ctx,
			user.id,
			undefined,
			{
				userAgent: req.headers['user-agent'],
				ipAddress: req.ip
			}
		);
		const accessToken = await AuthLogic.generateAccessToken(
			user,
			'user',
			refreshResult.sessionId
		);

		if (cartIds && cartIds.length > 0) {
			await CartLogic.claimCarts(ctx, { cartIds, userId: user.id });
		}

		res.cookie('refreshToken', refreshResult.token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res
			.status(200)
			.json({
				accessToken,
				refreshToken: refreshResult.token,
				userId: user.id
			});
	} catch (error) {
		return next(error);
	}
};

export const appleCallback = async (
	req: Request<{}, {}, AppleCallbackBody>,
	res: Response,
	next: NextFunction
) => {
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
				email: decodedToken.email
			});
		}

		const refreshResult = await AuthLogic.generateRefreshToken(
			ctx,
			user.id,
			undefined,
			{
				userAgent: req.headers['user-agent'],
				ipAddress: req.ip
			}
		);
		const accessToken = await AuthLogic.generateAccessToken(
			user,
			'user',
			refreshResult.sessionId
		);

		res.cookie('refreshToken', refreshResult.token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res
			.status(200)
			.json({
				accessToken,
				refreshToken: refreshResult.token,
				userId: user.id
			});
	} catch (error) {
		return next(error);
	}
};

export const refresh = async (
	req: Request<{}, {}, RefreshBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ error: 'Refresh token required' });
		}

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
		return next(error);
	}
};

export const logout = async (
	req: Request<{}, {}, LogoutBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (refreshToken) {
			const ctx = getAppContext(req);
			await AuthLogic.revokeRefreshToken(ctx, refreshToken);
		}

		res.clearCookie('refreshToken', { path: '/' });
		return res.status(200).json({ message: 'Logged out' });
	} catch (error) {
		return next(error);
	}
};
