import { Request, Response, NextFunction } from 'express';

import * as AdminLogic from '../core/logic/admin';
import * as AuthLogic from '../core/logic/auth';
import * as StoreData from '../core/data/stores';
import * as AdminSessionData from '../core/data/adminSessions';
import { getAppContext } from '../utils/context';
import type { StripUndefined } from '../utils/objects';
import { env } from '../config/env';
import type {
	AdminLoginBody,
	AdminCreateStoreBody,
	BulkUserUpdateBody,
	BulkIdsBody,
	BulkOrderUpdateBody,
	BulkProductUpdateBody,
	BulkStoreUpdateBody
} from '../core/validations/rest';

export const login = async (
	req: Request<{}, {}, AdminLoginBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.adminLogin(ctx, {
			email,
			password,
			userAgent: req.headers['user-agent'],
			ipAddress: req.ip
		});

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
	req: Request<{}, {}, AdminCreateStoreBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const store = await StoreData.createStore(
			ctx.prisma,
			req.body as StripUndefined<AdminCreateStoreBody>
		);
		return res.status(201).json({ store });
	} catch (error) {
		return next(error);
	}
};

// Bulk User Operations
export const bulkUpdateUsers = async (
	req: Request<{}, {}, BulkUserUpdateBody>,
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
	req: Request<{}, {}, BulkIdsBody>,
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
	req: Request<{}, {}, BulkOrderUpdateBody>,
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
	req: Request<{}, {}, BulkIdsBody>,
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
	req: Request<{}, {}, BulkProductUpdateBody>,
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
	req: Request<{}, {}, BulkIdsBody>,
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

// Bulk Store Operations
export const bulkUpdateStores = async (
	req: Request<{}, {}, BulkStoreUpdateBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, field, value } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateStores(ctx, ids, field, value);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkDeleteStores = async (
	req: Request<{}, {}, BulkIdsBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkDeleteStores(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const getSessions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const sessions = await AdminSessionData.getAdminSessions(
			ctx.prisma,
			ctx.user!.id
		);
		return res.json({ sessions });
	} catch (error) {
		return next(error);
	}
};

export const revokeSession = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const session = await AdminSessionData.getAdminSessionById(
			ctx.prisma,
			req.params.id
		);

		if (!session || session.adminId !== ctx.user!.id) {
			return res.status(404).json({ error: 'Session not found' });
		}

		await AdminSessionData.revokeAdminSession(ctx.prisma, req.params.id);
		return res.json({ message: 'Session revoked' });
	} catch (error) {
		return next(error);
	}
};
