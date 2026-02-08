import { NextFunction, Request, Response } from 'express';

import { hydrateQuery, productFiltersSchema } from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';
import * as PayoutLogic from '../core/logic/payouts';

export const getStores = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	try {
		const ctx = getAppContext(req);

		const stores = await StoreLogic.getStores(ctx, query);

		return res.json({ stores });
	} catch (error) {
		return next(error);
	}
};

export const createStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, description, website, twitter, instagram } = req.body;

	const ctx = getAppContext(req);

	try {
		const store = await StoreLogic.createStore(ctx, {
			name,
			description,
			website,
			twitter,
			instagram
		});

		return res.status(201).json({ store });
	} catch (error) {
		return next(error);
	}
};

export const updateStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, description, website, twitter, instagram, unlisted } = req.body;
	const storeId = req.params.id;

	if (!storeId) {
		return res.status(400).json({ message: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	try {
		const store = await StoreLogic.updateStore(ctx, {
			storeId,
			name,
			description,
			website,
			twitter,
			instagram,
			unlisted
		});
		return res.status(200).json({ store });
	} catch (error) {
		return next(error);
	}
};

export const getCurrentStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const store = await StoreLogic.getStoreById(ctx, ctx.storeId);

		return res.json(store);
	} catch (error) {
		return next(error);
	}
};

export const getStorePayouts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	try {
		if (ctx.isAdmin) {
			storeId = req.params.id;
		}

		if (!storeId) {
			return res.status(400).json({ error: 'Store ID is required' });
		}

		const payouts = await StoreLogic.getStorePayouts(ctx, storeId);

		return res.json({ payouts });
	} catch (error) {
		return next(error);
	}
};

export const getStoreById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const storeWithContext = await StoreLogic.getStoreById(ctx, req.params.id);

		if (!storeWithContext) {
			return res.status(404).json({ error: 'Store not found' });
		}

		return res.json(storeWithContext);
	} catch (error) {
		return next(error);
	}
};

export const getCurrentStoreProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const products = await StoreLogic.getStoreProducts(
			ctx,
			ctx.storeId,
			productFiltersSchema.parse(req.query)
		);

		return res.json({ products });
	} catch (error) {
		return next(error);
	}
};

export const getStoreProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	try {
		const products = await StoreLogic.getStoreProducts(
			ctx,
			req.params.id,
			productFiltersSchema.parse(req.query)
		);

		return res.json({ products });
	} catch (error) {
		return next(error);
	}
};

export const createStoreProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, description, unitPrice, quantity } = req.body;

	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const product = await ProductLogic.createProduct(ctx, {
			name,
			description,
			unitPrice,
			quantity,
			storeId: ctx.storeId
		});

		return res.json({ product });
	} catch (error) {
		return next(error);
	}
};

export const getStoreOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	try {
		if (ctx.isAdmin) {
			storeId = req.params.id;
		}

		if (!storeId) {
			return res.status(400).json({ error: 'Store ID is required' });
		}

		const query = hydrateQuery(req.query);

		const orders = await StoreLogic.getStoreOrders(ctx, storeId, query);

		return res.json({ orders });
	} catch (error) {
		return next(error);
	}
};

export const getStoreManagers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	try {
		if (ctx.isAdmin) {
			storeId = req.params.id;
		}

		if (!storeId) {
			return res.status(400).json({ error: 'Store ID is required' });
		}

		const query = hydrateQuery(req.query);

		const managers = await StoreLogic.getStoreManagers(ctx, storeId, query);

		return res.json({ managers });
	} catch (error) {
		return next(error);
	}
};

export const followStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	try {
		const follower = await StoreLogic.followStore(ctx, {
			storeId: req.params.id
		});

		return res.status(200).json({ follower });
	} catch (error) {
		return next(error);
	}
};

export const unfollowStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	try {
		const follower = await StoreLogic.unfollowStore(ctx, {
			storeId: req.params.id
		});

		return res.status(200).json({ follower });
	} catch (error) {
		return next(error);
	}
};

export const deleteStore = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	try {
		await StoreLogic.deleteStore(ctx, { storeId: req.params.id });
		return res.status(204).send();
	} catch (error) {
		return next(error);
	}
};

export const getCurrentStorePayouts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const payouts = await StoreLogic.getStorePayouts(ctx, ctx.storeId);
		return res.json({ payouts });
	} catch (error) {
		return next(error);
	}
};

export const getCurrentStorePayoutById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	try {
		const payout = await PayoutLogic.getPayoutById(ctx, req.params.id);
		return res.json({ payout });
	} catch (error) {
		return next(error);
	}
};

export const getStoreOverview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const lowStockProducts = await ctx.prisma.product.findMany({
			where: { storeId: ctx.storeId, quantity: { lt: 5 } },
			include: { images: true, categories: { include: { category: true } } }
		});

		return res.json({ lowStockProducts });
	} catch (error) {
		return next(error);
	}
};

export const getStoreCustomer = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const customer = await StoreLogic.getStoreCustomer(
			ctx,
			ctx.storeId,
			req.params.id
		);
		return res.json({ user: customer });
	} catch (error) {
		return next(error);
	}
};

export const getCurrentStoreOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const query = hydrateQuery(req.query);
		const orders = await StoreLogic.getStoreOrders(ctx, ctx.storeId, query);
		return res.json({ orders });
	} catch (error) {
		return next(error);
	}
};
