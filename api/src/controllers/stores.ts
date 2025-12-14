import { Request, Response } from 'express';

import { hydrateQuery, productFiltersSchema } from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';

export const getStores = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);
	const ctx = getAppContext(req);

	const stores = await StoreLogic.getStores(ctx, query);

	return res.json({ stores });
};

export const createStore = async (req: Request, res: Response) => {
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
		return res.status(500).json({ error: (error as Error)?.message });
	}
};

export const getCurrentStore = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const store = await StoreLogic.getStoreById(ctx, ctx.storeId);

	return res.json({ store });
};

export const getStorePayouts = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	const isAdmin = await ctx.isAdmin();

	if (isAdmin) {
		storeId = req.params.id;
	}

	if (!storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const payouts = await StoreLogic.getStorePayouts(ctx, storeId);

	return res.json({ payouts });
};

export const getStoreById = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const storeWithContext = await StoreLogic.getStoreById(ctx, req.params.id);

	if (!storeWithContext) {
		return res.status(404).json({ error: 'Store not found' });
	}

	return res.json(storeWithContext);
};

export const getStoreProducts = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	const products = await StoreLogic.getStoreProducts(
		ctx,
		req.params.id,
		productFiltersSchema.parse(req.query)
	);

	return res.json({ products });
};

export const createStoreProduct = async (req: Request, res: Response) => {
	const { name, description, unitPrice, quantity } = req.body;

	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const product = await ProductLogic.createProduct(ctx, {
		name,
		description,
		unitPrice,
		quantity,
		storeId: ctx.storeId
	});

	return res.json({ product });
};

export const getStoreOrders = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	const isAdmin = await ctx.isAdmin();

	if (isAdmin) {
		storeId = req.params.id;
	}

	if (!storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const query = hydrateQuery(req.query);

	const orders = await StoreLogic.getStoreOrders(ctx, storeId, query);

	return res.json({ orders });
};

export const getStoreManagers = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	let storeId = ctx.storeId;

	const isAdmin = await ctx.isAdmin();

	if (isAdmin) {
		storeId = req.params.id;
	}

	if (!storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const query = hydrateQuery(req.query);

	const managers = await StoreLogic.getStoreManagers(ctx, storeId, query);

	return res.json({ managers });
};

export const followStore = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	const follower = await StoreLogic.followStore(ctx, {
		storeId: req.params.id
	});

	return res.status(200).json({ follower });
};

export const unfollowStore = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const ctx = getAppContext(req);

	const follower = await StoreLogic.unfollowStore(ctx, {
		storeId: req.params.id
	});

	return res.status(200).json({ follower });
};
