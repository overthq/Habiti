import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as AuthLogic from '../core/logic/auth';
import * as UserLogic from '../core/logic/users';
import * as CartLogic from '../core/logic/carts';

import { env } from '../config/env';
import { getAppContext } from '../utils/context';
import { logicErrorToApiException, LogicErrorCode } from '../core/logic/errors';

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, password } = req.body;
	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.register(ctx, { name, email, password });

		return res.status(201).json({ user });
	} catch (error) {
		console.error('[AuthController.register] Unexpected error', error);
		return next(logicErrorToApiException(LogicErrorCode.Unexpected));
	}
};

export const login = async (
	req: Request,
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
		console.error('[AuthController.login] Unexpected error', error);
		return next(logicErrorToApiException(LogicErrorCode.Unexpected));
	}
};

export const verify = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, code, cartIds } = req.body;

	if (!email || !code) {
		return res
			.status(400)
			.json({ error: 'Email and verification code are required.' });
	}

	const cachedCodeResult = await AuthLogic.retrieveVerificationCode(email);

	if (!cachedCodeResult.ok) {
		return next(logicErrorToApiException(cachedCodeResult.error));
	}

	const cachedCode = cachedCodeResult.data;

	if (!cachedCode) {
		return next(logicErrorToApiException(LogicErrorCode.NotFound));
	}

	if (cachedCode === code) {
		const ctx = getAppContext(req);
		const user = await UserLogic.getUserByEmail(ctx, email);

		if (!user) {
			return next(logicErrorToApiException(LogicErrorCode.UserNotFound));
		}

		const accessTokenResult = await AuthLogic.generateAccessToken(user);
		if (!accessTokenResult.ok) {
			return next(logicErrorToApiException(accessTokenResult.error));
		}
		const refreshTokenResult = await AuthLogic.generateRefreshToken(
			ctx,
			user.id
		);
		if (!refreshTokenResult.ok) {
			return next(logicErrorToApiException(refreshTokenResult.error));
		}
		const accessToken = accessTokenResult.data;
		const refreshToken = refreshTokenResult.data;

		// FIXME: A session-id based approach is way better for handling this, but
		// suffer it to be so for now.
		if (cartIds && cartIds.length > 0) {
			const claimResult = await CartLogic.claimCarts(ctx, { cartIds });
			if (!claimResult.ok) {
				return next(logicErrorToApiException(claimResult.error));
			}
		}

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

export const appleCallback = async (
	req: Request,
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

		const accessTokenResult = await AuthLogic.generateAccessToken(user);
		if (!accessTokenResult.ok) {
			return next(logicErrorToApiException(accessTokenResult.error));
		}
		const refreshTokenResult = await AuthLogic.generateRefreshToken(
			ctx,
			user.id
		);
		if (!refreshTokenResult.ok) {
			return next(logicErrorToApiException(refreshTokenResult.error));
		}
		const accessToken = accessTokenResult.data;
		const refreshToken = refreshTokenResult.data;

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json({ accessToken, refreshToken, userId: user.id });
	} catch (error) {
		console.error('[AuthController.appleCallback] Unexpected error', error);
		return next(logicErrorToApiException(LogicErrorCode.Unexpected));
	}
};

export const refresh = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (!refreshToken) {
		return res.status(401).json({ error: 'Refresh token required' });
	}

	const ctx = getAppContext(req);
	const tokensResult = await AuthLogic.rotateRefreshToken(ctx, refreshToken);

	if (!tokensResult.ok) {
		return next(logicErrorToApiException(tokensResult.error));
	}

	res.cookie('refreshToken', tokensResult.data.refreshToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/'
	});

	return res.status(200).json(tokensResult.data);
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (refreshToken) {
		const ctx = getAppContext(req);
		const revokeResult = await AuthLogic.revokeRefreshToken(ctx, refreshToken);
		if (!revokeResult.ok) {
			return next(logicErrorToApiException(revokeResult.error));
		}
	}

	res.clearCookie('refreshToken', { path: '/' });
	return res.status(200).json({ message: 'Logged out' });
};
