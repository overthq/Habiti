import { Request, Response, NextFunction } from 'express';

import * as AdminLogic from '../core/logic/admin';
import * as AuthLogic from '../core/logic/auth';
import * as StoreData from '../core/data/stores';
import { getAppContext } from '../utils/context';
import { OrderStatus, ProductStatus } from '../generated/prisma/client';
import { env } from '../config/env';

export const login = async (
	req: Request<{}, { email: string; password: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.adminLogin(ctx, { email, password });

		res.cookie('adminRefreshToken', result.refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.json({
			accessToken: result.accessToken,
			adminId: result.adminId
		});
	} catch (error) {
		return next(error);
	}
};

export const refresh = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.adminRefreshToken || req.body.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ error: 'Refresh token required' });
		}

		const ctx = getAppContext(req);
		const tokens = await AuthLogic.rotateAdminRefreshToken(ctx, refreshToken);

		res.cookie('adminRefreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		return res.status(200).json({ accessToken: tokens.accessToken });
	} catch (error) {
		return next(error);
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.adminRefreshToken || req.body.refreshToken;

		if (refreshToken) {
			const ctx = getAppContext(req);
			await AuthLogic.revokeAdminRefreshToken(ctx, refreshToken);
		}

		res.clearCookie('adminRefreshToken', { path: '/' });
		return res.status(200).json({ message: 'Logged out' });
	} catch (error) {
		return next(error);
	}
};

export const getOverview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const overview = await AdminLogic.getAdminOverview(ctx);
		return res.status(200).json(overview);
	} catch (error) {
		return next(error);
	}
};

export const createStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description } = req.body;
		const ctx = getAppContext(req);
		const store = await StoreData.createStore(ctx.prisma, {
			name,
			description
		});
		return res.status(201).json({ store });
	} catch (error) {
		return next(error);
	}
};

// Bulk User Operations
export const bulkUpdateUsers = async (
	req: Request<{}, {}, { ids: string[]; field: 'suspended'; value: boolean }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, field, value } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateUsers(ctx, ids, field, value);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkDeleteUsers = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkDeleteUsers(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

// Bulk Order Operations
export const bulkUpdateOrders = async (
	req: Request<{}, {}, { ids: string[]; field: 'status'; value: OrderStatus }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, field, value } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateOrders(ctx, ids, field, value);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkDeleteOrders = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkDeleteOrders(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

// Bulk Product Operations
export const bulkUpdateProducts = async (
	req: Request<
		{},
		{},
		{ ids: string[]; field: 'status'; value: ProductStatus }
	>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, field, value } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateProducts(ctx, ids, field, value);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkDeleteProducts = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkDeleteProducts(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};
