import { NextFunction, Request, Response } from 'express';

import {
	hydrateQuery,
	orderFiltersSchema,
	productFiltersSchema
} from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';
import * as PayoutLogic from '../core/logic/payouts';

// Re-exports from other controllers (handlers that only use req.params/req.body)
export {
	getProductById,
	getProductReviews,
	deleteProduct,
	updateProduct,
	updateProductCategories,
	createStoreCategory as createCategory,
	updateStoreCategory as updateCategory,
	deleteStoreCategory as deleteCategory
} from './products';
export { getOrderById, updateOrder } from './orders';
export { createPayout, verifyBankAccount } from './payouts';

export const getStore = async (
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

export const updateStore = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		name,
		description,
		website,
		twitter,
		instagram,
		unlisted,
		imageUrl,
		imagePublicId
	} = req.body;
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const store = await StoreLogic.updateStore(ctx, {
			storeId: ctx.storeId,
			name,
			description,
			website,
			twitter,
			instagram,
			unlisted,
			imageUrl,
			imagePublicId
		});
		return res.status(200).json({ store });
	} catch (error) {
		return next(error);
	}
};

export const getProducts = async (
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

export const getPayouts = async (
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

export const getPayoutById = async (
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

export const getOverview = async (
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

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const orders = await StoreLogic.getStoreOrders(
			ctx,
			ctx.storeId,
			orderFiltersSchema.parse(req.query)
		);
		return res.json({ orders });
	} catch (error) {
		return next(error);
	}
};

export const getManagers = async (
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
		const managers = await StoreLogic.getStoreManagers(ctx, ctx.storeId, query);
		return res.json({ managers });
	} catch (error) {
		return next(error);
	}
};

export const getCustomer = async (
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

export const createProduct = async (
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

export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const categories = await ProductLogic.getStoreProductCategories(
			ctx,
			ctx.storeId
		);
		return res.json({ categories });
	} catch (error) {
		return next(error);
	}
};
