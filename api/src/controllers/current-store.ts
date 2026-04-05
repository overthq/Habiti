import { NextFunction, Request, Response } from 'express';

import {
	hydrateQuery,
	orderFiltersSchema,
	productFiltersSchema
} from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';
import * as TransactionLogic from '../core/logic/transactions';
import * as AddressLogic from '../core/logic/addresses';
import { ProductStatus } from '../generated/prisma/client';
import { resolveAccountNumber } from '../core/payments';
import type {
	UpdateStoreBody,
	StoreCreateProductBody,
	CreatePayoutBody,
	VerifyBankAccountBody,
	CreateAddressBody,
	UpdateAddressBody
} from '../core/validations/rest';

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

export const verifyBankAccount = async (
	req: Request<{}, {}, VerifyBankAccountBody>,
	res: Response,
	next: NextFunction
) => {
	const { bankAccountNumber, bankCode } = req.body;

	try {
		const { data } = await resolveAccountNumber({
			accountNumber: bankAccountNumber,
			bankCode
		});

		return res.json({
			accountNumber: data.account_number,
			accountName: data.account_name
		});
	} catch (error) {
		return next(error);
	}
};

export const createPayout = async (
	req: Request<{}, {}, CreatePayoutBody>,
	res: Response,
	next: NextFunction
) => {
	const { amount } = req.body;

	try {
		const ctx = getAppContext(req);
		const transaction = await TransactionLogic.createPayoutTransaction(ctx, {
			amount
		});
		return res.status(201).json({ transaction });
	} catch (error) {
		return next(error);
	}
};

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
	req: Request<{}, {}, UpdateStoreBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	if (!ctx.storeId) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const store = await StoreLogic.updateStore(ctx, {
			storeId: ctx.storeId,
			...req.body
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
			where: {
				storeId: ctx.storeId,
				quantity: { lt: 5 },
				status: { not: ProductStatus.Archived }
			},
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
	req: Request<{}, {}, StoreCreateProductBody>,
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

export const getAddresses = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const addresses = await AddressLogic.getStoreAddresses(ctx);
		return res.json({ addresses });
	} catch (error) {
		return next(error);
	}
};

export const createAddress = async (
	req: Request<{}, {}, CreateAddressBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const address = await AddressLogic.createStoreAddress(ctx, req.body);
		return res.status(201).json({ address });
	} catch (error) {
		return next(error);
	}
};

export const updateAddress = async (
	req: Request<{ id: string }, {}, UpdateAddressBody>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		const address = await AddressLogic.editStoreAddress(
			ctx,
			req.params.id,
			req.body
		);
		return res.json({ address });
	} catch (error) {
		return next(error);
	}
};

export const deleteAddress = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	try {
		await AddressLogic.deleteStoreAddress(ctx, req.params.id);
		return res.status(204).end();
	} catch (error) {
		return next(error);
	}
};
