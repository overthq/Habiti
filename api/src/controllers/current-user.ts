import { NextFunction, Request, Response } from 'express';

import * as UserLogic from '../core/logic/users';
import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';

// Re-exports from other controllers (handlers that only use req.params/req.body)
export { getOrderById, createOrder } from './orders';
export { getCartById } from './carts';
export { authorizeCard, deleteCard } from './cards';

export const getUser = async (
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

export const updateUser = async (
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
