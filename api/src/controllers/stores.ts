import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';
import { uploadImages } from '../utils/upload';
import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';

const loadCurrentStore = async (req: Request) => {
	const store = await prismaClient.store.findUnique({
		where: {
			id: req.headers['x-market-store-id'] as string
		}
	});

	if (!store) {
		throw new Error('Store not found');
	}

	return store;
};

export const getStores = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const stores = await prismaClient.store.findMany(query);

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
		return res.status(500).json({ error: error.message });
	}
};

export const getCurrentStore = async (req: Request, res: Response) => {
	const store = await loadCurrentStore(req);

	return res.json({ store });
};

export const getCurrentStorePayouts = async (req: Request, res: Response) => {
	const store = await loadCurrentStore(req);

	const payouts = await prismaClient.payout.findMany({
		where: { storeId: store.id }
	});

	return res.json({ payouts });
};

export const getCurrentStoreManagers = async (req: Request, res: Response) => {
	const store = await loadCurrentStore(req);

	const managers = await prismaClient.storeManager.findMany({
		where: { storeId: store.id }
	});

	return res.json({ managers });
};

export const getStorePayouts = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const query = hydrateQuery(req.query);

	const payouts = await prismaClient.payout.findMany({
		where: { storeId: req.params.id },
		...query
	});

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

	const query = hydrateQuery(req.query);

	const products = await prismaClient.store
		.findUnique({ where: { id: req.params.id } })
		.products(query);

	return res.json({ products });
};

export const createStoreProduct = async (req: Request, res: Response) => {
	const { name, description, unitPrice, quantity, imageFiles } = req.body;

	if (!req.headers['x-market-store-id']) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	// Image uploads have to be handled differently in REST
	const uploadedImages = await uploadImages(imageFiles);

	const product = await prismaClient.product.create({
		data: {
			name,
			description,
			unitPrice,
			quantity,
			storeId: req.headers['x-market-store-id'] as string,
			images: {
				createMany: {
					data: uploadedImages.map(({ url, public_id }) => ({
						path: url,
						publicId: public_id
					}))
				}
			}
		}
	});

	return res.json({ product });
};

export const getStoreOrders = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const query = hydrateQuery(req.query);

	// Add include user to the query
	const orders = await prismaClient.store
		.findUnique({ where: { id: req.params.id } })
		.orders({
			...query,
			include: { user: true }
		});

	return res.json({ orders });
};

export const getStoreManagers = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	const managers = await prismaClient.store
		.findUnique({ where: { id: req.params.id } })
		.managers({ include: { manager: true } });

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
