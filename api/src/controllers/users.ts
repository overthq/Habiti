import { NextFunction, Request, Response } from 'express';
import * as UserLogic from '../core/logic/users';

import { userFiltersSchema, hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getCurrentUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.getCurrentUser(ctx);

		return res.json({ user });
	} catch (error) {
		return next(error);
	}
};

export const updateCurrentUser = async (
	req: Request<{}, {}, { name: string; email: string }>,
	res: Response,
	next: NextFunction
) => {
	const { name, email } = req.body;

	const ctx = getAppContext(req);

	try {
		const updatedUser = await UserLogic.updateCurrentUser(ctx, { name, email });

		return res.json({ user: updatedUser });
	} catch (error) {
		return next(error);
	}
};

export const deleteCurrentUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		await UserLogic.deleteCurrentUser(ctx);

		return res.status(204).json({ message: 'User deleted' });
	} catch (error) {
		return next(error);
	}
};

export const getFollowedStores = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const stores = await UserLogic.getFollowedStores(ctx);

		return res.json({ stores });
	} catch (error) {
		return next(error);
	}
};

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	try {
		const orders = await UserLogic.getOrders(ctx, query);

		return res.json({ orders });
	} catch (error) {
		return next(error);
	}
};

export const getCarts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	try {
		const carts = await UserLogic.getCarts(ctx, query);

		return res.json({ carts });
	} catch (error) {
		return next(error);
	}
};

export const getCards = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const cards = await UserLogic.getCards(ctx);

		return res.json({ cards });
	} catch (error) {
		return next(error);
	}
};

export const getManagedStores = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const stores = await UserLogic.getManagedStores(ctx);

		return res.json({ stores });
	} catch (error) {
		return next(error);
	}
};

export const getDeliveryAddresses = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const addresses = await UserLogic.getDeliveryAddresses(ctx);

		return res.json({ addresses });
	} catch (error) {
		return next(error);
	}
};

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const filters = userFiltersSchema.parse(req.query);

	const ctx = getAppContext(req);

	try {
		const users = await UserLogic.getUsers(ctx, filters);

		return res.json({ users });
	} catch (error) {
		return next(error);
	}
};

export const getUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.getUserById(ctx, id);

		return res.json({ user });
	} catch (error) {
		return next(error);
	}
};
