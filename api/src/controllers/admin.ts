import { Request, Response, NextFunction } from 'express';

import * as AdminLogic from '../core/logic/admin';
import * as StoreData from '../core/data/stores';
import { getAppContext } from '../utils/context';
import { OrderStatus, ProductStatus } from '../generated/prisma/client';

export const login = async (
	req: Request<{}, { email: string; password: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.adminLogin(ctx, { email, password });
		return res.json(result);
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
export const bulkSuspendUsers = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkSuspendUsers(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkUnsuspendUsers = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUnsuspendUsers(ctx, ids);
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
export const bulkCancelOrders = async (
	req: Request<{}, {}, { ids: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkCancelOrders(ctx, ids);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const bulkUpdateOrderStatus = async (
	req: Request<{}, {}, { ids: string[]; status: OrderStatus }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, status } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateOrderStatus(ctx, ids, status);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

// Bulk Product Operations
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

export const bulkUpdateProductStatus = async (
	req: Request<{}, {}, { ids: string[]; status: ProductStatus }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids, status } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.bulkUpdateProductStatus(ctx, ids, status);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};
