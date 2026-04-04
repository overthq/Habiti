import { NextFunction, Request, Response } from 'express';

import * as UserLogic from '../core/logic/users';
import * as ProductLogic from '../core/logic/products';
import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';
import type {
	UpdateUserBody,
	AddToWatchlistBody,
	SavePushTokenBody,
	DeletePushTokenBody
} from '../core/validations/rest';

// Re-exports from other controllers (handlers that only use req.params/req.body)
export { getOrderById, createOrder, confirmPickup } from './orders';
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
	req: Request<{}, {}, UpdateUserBody>,
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

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		await UserLogic.deleteCurrentUser(ctx);
		return res.status(204).end();
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

export const getWatchlist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const user = await ctx.prisma.user
			.findUnique({ where: { id: ctx.user!.id } })
			.watchlist({
				include: {
					product: {
						include: { store: true, images: true }
					}
				}
			});
		return res.json({ watchlist: user ?? [] });
	} catch (error) {
		return next(error);
	}
};

export const addToWatchlist = async (
	req: Request<{}, {}, AddToWatchlistBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const item = await ProductLogic.addToWatchlist(ctx, {
			productId: req.body.productId
		});
		return res.json({ watchlistProduct: item });
	} catch (error) {
		return next(error);
	}
};

export const getPushTokens = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const pushTokens = await ctx.prisma.userPushToken.findMany({
			where: { userId: ctx.user!.id }
		});
		return res.json({ pushTokens });
	} catch (error) {
		return next(error);
	}
};

export const savePushToken = async (
	req: Request<{}, {}, SavePushTokenBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const pushToken = await ctx.prisma.userPushToken.create({
			data: {
				token: req.body.token,
				type: req.body.type,
				user: { connect: { id: ctx.user!.id } }
			}
		});
		return res.json({ pushToken });
	} catch (error) {
		return next(error);
	}
};

export const deletePushToken = async (
	req: Request<{ token: string }, {}, DeletePushTokenBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const pushToken = await ctx.prisma.userPushToken.delete({
			where: {
				userId_token: {
					userId: ctx.user!.id,
					token: req.params.token
				},
				type: req.body.type
			}
		});
		return res.json({ pushToken });
	} catch (error) {
		return next(error);
	}
};
