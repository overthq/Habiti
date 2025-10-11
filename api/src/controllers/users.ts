import { Request, Response } from 'express';
import * as UserLogic from '../core/logic/users';

import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getCurrentUser = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const user = await UserLogic.getCurrentUser(ctx);

	return res.json({ user });
};

export const updateCurrentUser = async (
	req: Request<{}, {}, { name: string; email: string }>,
	res: Response
) => {
	const { name, email } = req.body;

	const ctx = getAppContext(req);
	const updatedUser = await UserLogic.updateCurrentUser(ctx, { name, email });

	return res.json({ user: updatedUser });
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	await UserLogic.deleteCurrentUser(ctx);

	return res.status(204).json({ message: 'User deleted' });
};

export const getFollowedStores = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const stores = await UserLogic.getFollowedStores(ctx);

	return res.json({ stores });
};

export const getOrders = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);
	const orders = await UserLogic.getOrders(ctx, query);

	return res.json({ orders });
};

export const getCarts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);
	const carts = await UserLogic.getCarts(ctx, query);

	return res.json({ carts });
};

export const getCards = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const cards = await UserLogic.getCards(ctx);

	return res.json({ cards });
};

export const getManagedStores = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const stores = await UserLogic.getManagedStores(ctx);

	return res.json({ stores });
};

export const getDeliveryAddresses = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const addresses = await UserLogic.getDeliveryAddresses(ctx);

	return res.json({ addresses });
};

export const getUsers = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);
	const users = await UserLogic.getUsers(ctx, query);

	return res.json({ users });
};

export const getUser = async (req: Request<{ id: string }>, res: Response) => {
	const { id } = req.params;

	const ctx = getAppContext(req);
	const user = await UserLogic.getUserById(ctx, id);

	return res.json({ user });
};
