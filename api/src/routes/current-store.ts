import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';
import {
	hydrateQuery,
	orderFiltersSchema,
	productFiltersSchema
} from '../utils/queries';
import { ProductStatus } from '../generated/prisma/client';
import { TransactionStatus, TransactionType } from '../generated/prisma/client';
import { resolveAccountNumber } from '../core/payments';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';
import * as OrderLogic from '../core/logic/orders';
import * as TransactionLogic from '../core/logic/transactions';
import * as AddressLogic from '../core/logic/addresses';
import * as Schemas from '../core/validations/rest';

const currentStore = new Hono<AppEnv>();

currentStore.use('*', authenticate, requireStoreContext);

currentStore.get('/', async c => {
	const store = await StoreLogic.getStoreById(c, c.var.storeId!);
	return c.json(store);
});

currentStore.put(
	'/',
	zValidator('json', Schemas.updateStoreBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const store = await StoreLogic.updateStore(c, {
			storeId: c.var.storeId!,
			...body
		});
		return c.json({ store });
	}
);

currentStore.get('/products', async c => {
	const products = await StoreLogic.getStoreProducts(
		c,
		c.var.storeId!,
		productFiltersSchema.parse(c.req.query())
	);
	return c.json({ products });
});

currentStore.get('/products/:id', async c => {
	const productWithContext = await ProductLogic.getProductById(
		c,
		c.req.param('id')
	);
	return c.json(productWithContext);
});

currentStore.get('/products/:id/reviews', async c => {
	const reviews = await ProductLogic.getProductReviews(c, c.req.param('id'));
	return c.json({ reviews });
});

currentStore.delete('/products/:id', async c => {
	await ProductLogic.archiveProduct(c, { productId: c.req.param('id') });
	return c.body(null, 204);
});

currentStore.get('/overview', async c => {
	const lowStockProducts = await c.var.prisma.product.findMany({
		where: {
			storeId: c.var.storeId!,
			quantity: { lt: 5 },
			status: { not: ProductStatus.Archived }
		},
		include: { images: true, categories: { include: { category: true } } }
	});

	return c.json({ lowStockProducts });
});

currentStore.get('/orders', async c => {
	const orders = await StoreLogic.getStoreOrders(
		c,
		c.var.storeId!,
		orderFiltersSchema.parse(c.req.query())
	);
	return c.json({ orders });
});

currentStore.get('/orders/:id', async c => {
	const id = c.req.param('id');

	const order = await OrderLogic.getOrderById(c, id);
	return c.json({ order });
});

currentStore.get('/managers', async c => {
	const query = hydrateQuery(c.req.query());
	const managers = await StoreLogic.getStoreManagers(c, c.var.storeId!, query);
	return c.json({ managers });
});

currentStore.get('/customers/:id', async c => {
	const customer = await StoreLogic.getStoreCustomer(
		c,
		c.var.storeId!,
		c.req.param('id')
	);
	return c.json({ user: customer });
});

currentStore.post(
	'/products',
	zValidator('json', Schemas.storeCreateProductBodySchema, zodHook),
	async c => {
		const { name, description, unitPrice, quantity } = c.req.valid('json');

		const product = await ProductLogic.createProduct(c, {
			name,
			description,
			unitPrice,
			quantity,
			storeId: c.var.storeId!
		});
		return c.json({ product });
	}
);

currentStore.put(
	'/products/:id',
	zValidator('json', Schemas.storeUpdateProductBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');

		const product = await ProductLogic.updateProduct(c, {
			productId: c.req.param('id'),
			...body
		});

		return c.json({ product });
	}
);

currentStore.put(
	'/products/:id/categories',
	zValidator('json', Schemas.updateProductCategoriesBodySchema, zodHook),
	async c => {
		const { add, remove } = c.req.valid('json');

		const product = await ProductLogic.updateProductCategories(c, {
			productId: c.req.param('id'),
			addCategoryIds: add,
			removeCategoryIds: remove
		});

		return c.json({ product });
	}
);

currentStore.put(
	'/orders/:id',
	zValidator('json', Schemas.updateOrderStatusBodySchema, zodHook),
	async c => {
		const id = c.req.param('id');
		const { status } = c.req.valid('json');

		const order = await OrderLogic.updateOrderStatus(c, {
			orderId: id,
			status
		});

		return c.json({ order });
	}
);

currentStore.post(
	'/payouts',
	zValidator('json', Schemas.createPayoutBodySchema, zodHook),
	async c => {
		const { amount } = c.req.valid('json');

		const transaction = await TransactionLogic.createPayoutTransaction(c, {
			amount
		});
		return c.json({ transaction }, 201);
	}
);

currentStore.post(
	'/verify-bank-account',
	zValidator('json', Schemas.verifyBankAccountBodySchema, zodHook),
	async c => {
		const { bankAccountNumber, bankCode } = c.req.valid('json');

		const { data } = await resolveAccountNumber({
			accountNumber: bankAccountNumber,
			bankCode
		});

		return c.json({
			accountNumber: data.account_number,
			accountName: data.account_name
		});
	}
);

currentStore.get('/transactions', async c => {
	if (!c.var.storeId) {
		return c.json({ error: 'Store context required' }, 400);
	}

	const query = c.req.query();

	const transactions = await TransactionLogic.getStoreTransactions(
		c,
		c.var.storeId,
		{
			type: query.type as TransactionType | undefined,
			status: query.status as TransactionStatus | undefined,
			from: query.from as string | undefined,
			to: query.to as string | undefined,
			limit: query.limit ? parseInt(query.limit as string, 10) : undefined,
			offset: query.offset ? parseInt(query.offset as string, 10) : undefined
		}
	);

	return c.json({ transactions });
});

currentStore.get('/transactions/:id', async c => {
	const id = c.req.param('id');

	const transaction = await TransactionLogic.getTransactionById(c, id);
	return c.json({ transaction });
});

currentStore.get('/categories', async c => {
	const categories = await ProductLogic.getStoreProductCategories(
		c,
		c.var.storeId!
	);
	return c.json({ categories });
});

currentStore.post(
	'/categories',
	zValidator('json', Schemas.createCategoryBodySchema, zodHook),
	async c => {
		const { name, description } = c.req.valid('json');

		const category = await ProductLogic.createStoreProductCategory(c, {
			name,
			description
		});

		return c.json({ category }, 201);
	}
);

currentStore.put(
	'/categories/:id',
	zValidator('json', Schemas.updateCategoryBodySchema, zodHook),
	async c => {
		const { name, description } = c.req.valid('json');

		const category = await ProductLogic.updateStoreProductCategory(c, {
			categoryId: c.req.param('id'),
			name,
			description
		});

		return c.json({ category });
	}
);

currentStore.delete('/categories/:id', async c => {
	await ProductLogic.deleteStoreProductCategory(c, {
		categoryId: c.req.param('id')
	});

	return c.body(null, 204);
});

currentStore.get('/addresses', async c => {
	const addresses = await AddressLogic.getStoreAddresses(c);
	return c.json({ addresses });
});

currentStore.post(
	'/addresses',
	zValidator('json', Schemas.createAddressBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const address = await AddressLogic.createStoreAddress(c, body);
		return c.json({ address }, 201);
	}
);

currentStore.put(
	'/addresses/:id',
	zValidator('json', Schemas.updateAddressBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const address = await AddressLogic.editStoreAddress(
			c,
			c.req.param('id'),
			body
		);
		return c.json({ address });
	}
);

currentStore.delete('/addresses/:id', async c => {
	await AddressLogic.deleteStoreAddress(c, c.req.param('id'));
	return c.body(null, 204);
});

export default currentStore;
