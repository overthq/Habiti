import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { isAdmin } from '../middleware/auth';
import {
	hydrateQuery,
	orderFiltersSchema,
	productFiltersSchema,
	userFiltersSchema
} from '../utils/queries';
import { env } from '../config/env';
import { TransactionStatus, TransactionType } from '../generated/prisma/client';
import type { StripUndefined } from '../utils/objects';
import type { AdminCreateStoreBody } from '../core/validations/rest';
import * as AdminLogic from '../core/logic/admin';
import * as AuthLogic from '../core/logic/auth';
import * as StoreLogic from '../core/logic/stores';
import * as StoreData from '../core/data/stores';
import * as ProductLogic from '../core/logic/products';
import * as UserLogic from '../core/logic/users';
import * as OrderLogic from '../core/logic/orders';
import * as TransactionLogic from '../core/logic/transactions';
import * as AdminSessionData from '../core/data/adminSessions';
import * as SessionData from '../core/data/sessions';
import * as Schemas from '../core/validations/rest';

const admin = new Hono<AppEnv>();

// Public admin routes (no auth)
admin.post(
	'/login',
	zValidator('json', Schemas.adminLoginBodySchema, zodHook),
	async c => {
		const { email, password } = c.req.valid('json');

		const result = await AdminLogic.adminLogin(c, {
			email,
			password,
			userAgent: c.req.header('user-agent'),
			ipAddress: c.req.header('x-forwarded-for') ?? undefined
		});

		setCookie(c, 'adminRefreshToken', result.refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'Strict',
			path: '/'
		});

		return c.json({
			accessToken: result.accessToken,
			adminId: result.adminId
		});
	}
);

admin.post('/refresh', async c => {
	const body = await c.req.json().catch(() => ({}));
	const refreshToken = getCookie(c, 'adminRefreshToken') || body.refreshToken;

	if (!refreshToken) {
		return c.json({ error: 'Refresh token required' }, 401);
	}

	const tokens = await AuthLogic.rotateAdminRefreshToken(c, refreshToken);

	setCookie(c, 'adminRefreshToken', tokens.refreshToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'Strict',
		path: '/'
	});

	return c.json({ accessToken: tokens.accessToken });
});

admin.post('/logout', async c => {
	const body = await c.req.json().catch(() => ({}));
	const refreshToken = getCookie(c, 'adminRefreshToken') || body.refreshToken;

	if (refreshToken) {
		await AuthLogic.revokeAdminRefreshToken(c, refreshToken);
	}

	deleteCookie(c, 'adminRefreshToken', { path: '/' });
	return c.json({ message: 'Logged out' });
});

// Protected admin routes (all require isAdmin)
admin.use('*', isAdmin);

admin.get('/sessions', async c => {
	const sessions = await AdminSessionData.getAdminSessions(
		c.var.prisma,
		c.var.auth!.id
	);
	return c.json({ sessions });
});

admin.delete('/sessions/:id', async c => {
	const id = c.req.param('id');

	const session = await AdminSessionData.getAdminSessionById(c.var.prisma, id);

	if (!session || session.adminId !== c.var.auth!.id) {
		return c.json({ error: 'Session not found' }, 404);
	}

	await AdminSessionData.revokeAdminSession(c.var.prisma, id);
	return c.json({ message: 'Session revoked' });
});

admin.get('/overview', async c => {
	const overview = await AdminLogic.getAdminOverview(c);
	return c.json(overview);
});

admin.get('/stores', async c => {
	const query = hydrateQuery(c.req.query());

	const stores = await StoreLogic.getStores(c, query);
	return c.json({ stores });
});

admin.post(
	'/stores',
	zValidator('json', Schemas.adminCreateStoreSchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const store = await StoreData.createStore(
			c.var.prisma,
			body as StripUndefined<AdminCreateStoreBody>
		);
		return c.json({ store }, 201);
	}
);

admin.get('/stores/:id/managers', async c => {
	const storeId = c.req.param('id');
	const query = hydrateQuery(c.req.query());
	const managers = await StoreLogic.getStoreManagers(c, storeId, query);
	return c.json({ managers });
});

admin.get('/stores/:id/transactions', async c => {
	const id = c.req.param('id');

	const query = c.req.query();

	const transactions = await TransactionLogic.getStoreTransactions(c, id, {
		type: query.type as TransactionType | undefined,
		status: query.status as TransactionStatus | undefined,
		from: query.from as string | undefined,
		to: query.to as string | undefined,
		limit: query.limit ? parseInt(query.limit as string, 10) : undefined,
		offset: query.offset ? parseInt(query.offset as string, 10) : undefined
	});

	return c.json({ transactions });
});

admin.get('/stores/:id/orders', async c => {
	const storeId = c.req.param('id');
	const query = hydrateQuery(c.req.query());
	const orders = await StoreLogic.getStoreOrders(c, storeId, query);
	return c.json({ orders });
});

admin.get('/stores/:id', async c => {
	const storeWithContext = await StoreLogic.getStoreById(c, c.req.param('id'));

	if (!storeWithContext) {
		return c.json({ error: 'Store not found' }, 404);
	}

	return c.json(storeWithContext);
});

admin.put(
	'/stores/:id',
	zValidator('json', Schemas.adminUpdateStoreBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');

		const store = await StoreLogic.updateStore(c, {
			storeId: c.req.param('id'),
			...body
		});

		return c.json({ store });
	}
);

admin.get('/products', async c => {
	const filters = productFiltersSchema.parse(c.req.query());

	const products = await ProductLogic.getProducts(c, filters);
	return c.json({ products });
});

admin.post(
	'/products',
	zValidator('json', Schemas.createProductSchema, zodHook),
	async c => {
		const { name, description, unitPrice, quantity, storeId } =
			c.req.valid('json');

		const product = await ProductLogic.createProduct(c, {
			name,
			description,
			unitPrice,
			quantity,
			storeId
		});

		return c.json({ product });
	}
);

admin.get('/products/:id', async c => {
	const productWithContext = await ProductLogic.getProductById(
		c,
		c.req.param('id')
	);
	return c.json(productWithContext);
});

admin.put(
	'/products/:id',
	zValidator('json', Schemas.adminUpdateProductBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');

		const product = await ProductLogic.updateProduct(c, {
			productId: c.req.param('id'),
			...body
		});

		return c.json({ product });
	}
);

admin.delete('/products/:id', async c => {
	await ProductLogic.archiveProduct(c, { productId: c.req.param('id') });
	return c.body(null, 204);
});

admin.get('/products/:id/reviews', async c => {
	const reviews = await ProductLogic.getProductReviews(c, c.req.param('id'));
	return c.json({ reviews });
});

admin.get('/users', async c => {
	const filters = userFiltersSchema.parse(c.req.query());

	const users = await UserLogic.getUsers(c, filters);
	return c.json({ users });
});

admin.get('/users/:id', async c => {
	const { id } = c.req.param();

	const user = await UserLogic.getUserById(c, id);
	return c.json({ user });
});

admin.get('/users/:id/sessions', async c => {
	const { id } = c.req.param();
	const sessions = await SessionData.getUserSessions(c.var.prisma, id);
	return c.json({ sessions });
});

admin.put(
	'/users/:id',
	zValidator('json', Schemas.adminUpdateUserBodySchema, zodHook),
	async c => {
		const { id } = c.req.param();
		const body = c.req.valid('json');

		const user = await UserLogic.updateUser(c, { userId: id, ...body });
		return c.json({ user });
	}
);

admin.patch(
	'/transactions/:id',
	zValidator('json', Schemas.adminUpdateTransactionBodySchema, zodHook),
	async c => {
		const id = c.req.param('id');
		const { status } = c.req.valid('json');

		const transaction = await TransactionLogic.updatePayoutTransactionStatus(
			c,
			{ transactionId: id, status }
		);
		return c.json({ transaction });
	}
);

admin.get('/orders', async c => {
	const filters = orderFiltersSchema.parse(c.req.query());

	const orders = await OrderLogic.getOrders(c, filters);
	return c.json({ orders });
});

admin.get('/orders/:id', async c => {
	const id = c.req.param('id');

	const order = await OrderLogic.getOrderById(c, id);
	return c.json({ order });
});

admin.put(
	'/orders/:id',
	zValidator('json', Schemas.adminUpdateOrderBodySchema, zodHook),
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

admin.post(
	'/users/bulk',
	zValidator('json', Schemas.bulkUserUpdateSchema, zodHook),
	async c => {
		const { ids, field, value } = c.req.valid('json');

		const result = await AdminLogic.bulkUpdateUsers(c, ids, field, value);
		return c.json(result);
	}
);

admin.delete(
	'/users/bulk',
	zValidator('json', Schemas.bulkIdsSchema, zodHook),
	async c => {
		const { ids } = c.req.valid('json');

		const result = await AdminLogic.bulkDeleteUsers(c, ids);
		return c.json(result);
	}
);

admin.post(
	'/orders/bulk',
	zValidator('json', Schemas.bulkOrderUpdateSchema, zodHook),
	async c => {
		const { ids, field, value } = c.req.valid('json');

		const result = await AdminLogic.bulkUpdateOrders(c, ids, field, value);
		return c.json(result);
	}
);

admin.delete(
	'/orders/bulk',
	zValidator('json', Schemas.bulkIdsSchema, zodHook),
	async c => {
		const { ids } = c.req.valid('json');

		const result = await AdminLogic.bulkDeleteOrders(c, ids);
		return c.json(result);
	}
);

admin.post(
	'/products/bulk',
	zValidator('json', Schemas.bulkProductUpdateSchema, zodHook),
	async c => {
		const { ids, field, value } = c.req.valid('json');

		const result = await AdminLogic.bulkUpdateProducts(c, ids, field, value);
		return c.json(result);
	}
);

admin.delete(
	'/products/bulk',
	zValidator('json', Schemas.bulkIdsSchema, zodHook),
	async c => {
		const { ids } = c.req.valid('json');

		const result = await AdminLogic.bulkDeleteProducts(c, ids);
		return c.json(result);
	}
);

admin.post(
	'/stores/bulk',
	zValidator('json', Schemas.bulkStoreUpdateSchema, zodHook),
	async c => {
		const { ids, field, value } = c.req.valid('json');

		const result = await AdminLogic.bulkUpdateStores(c, ids, field, value);
		return c.json(result);
	}
);

admin.delete(
	'/stores/bulk',
	zValidator('json', Schemas.bulkIdsSchema, zodHook),
	async c => {
		const { ids } = c.req.valid('json');

		const result = await AdminLogic.bulkDeleteStores(c, ids);
		return c.json(result);
	}
);

export default admin;
