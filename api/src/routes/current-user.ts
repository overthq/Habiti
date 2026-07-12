import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate, requireFullAccount } from '../middleware/auth';
import { hydrateQuery } from '../utils/queries';
import * as UserLogic from '../core/logic/users';
import * as ProductLogic from '../core/logic/products';
import * as CartLogic from '../core/logic/carts';
import * as CardLogic from '../core/logic/cards';
import * as OrderLogic from '../core/logic/orders';
import * as AddressLogic from '../core/logic/addresses';
import * as SessionData from '../core/data/sessions';
import * as Schemas from '../core/validations/rest';

const currentUser = new Hono<AppEnv>();

currentUser.use('*', authenticate);

currentUser.get('/', async c => {
	const user = await UserLogic.getCurrentUser(c);
	return c.json({ user });
});

currentUser.put(
	'/',
	zValidator('json', Schemas.updateUserBodySchema, zodHook),
	async c => {
		const { name, email } = c.req.valid('json');

		const updatedUser = await UserLogic.updateCurrentUser(c, { name, email });
		return c.json({ user: updatedUser });
	}
);

currentUser.delete('/', async c => {
	await UserLogic.deleteCurrentUser(c);
	return c.body(null, 204);
});

currentUser.get('/followed-stores', async c => {
	const stores = await UserLogic.getFollowedStores(c);
	return c.json({ stores });
});

currentUser.get('/managed-stores', async c => {
	const stores = await UserLogic.getManagedStores(c);
	return c.json({ stores });
});

const orderQueryFields = ['status', 'storeId', 'total', 'createdAt'] as const;
const orderQueryOrderBy = ['total', 'createdAt'] as const;
const cartQueryFields = ['storeId', 'createdAt'] as const;
const cartQueryOrderBy = ['createdAt'] as const;

currentUser.get('/orders', async c => {
	const query = hydrateQuery(c.req.query(), {
		allowedFields: orderQueryFields,
		allowedOrderBy: orderQueryOrderBy
	});

	const orders = await UserLogic.getOrders(c, query);
	return c.json({ orders });
});

currentUser.get('/carts', async c => {
	const query = hydrateQuery(c.req.query(), {
		allowedFields: cartQueryFields,
		allowedOrderBy: cartQueryOrderBy
	});

	const carts = await UserLogic.getCarts(c, query);
	return c.json({ carts });
});

currentUser.get('/carts/:id', async c => {
	const cartWithContext = await CartLogic.getCartById(c, c.req.param('id'));
	return c.json(cartWithContext);
});

currentUser.get('/cards', async c => {
	const cards = await UserLogic.getCards(c);
	return c.json({ cards });
});

currentUser.get('/delivery-addresses', async c => {
	const addresses = await UserLogic.getDeliveryAddresses(c);
	return c.json({ addresses });
});

currentUser.post(
	'/delivery-addresses',
	zValidator('json', Schemas.createAddressBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const address = await AddressLogic.createUserAddress(c, body);
		return c.json({ address }, 201);
	}
);

currentUser.put(
	'/delivery-addresses/:id',
	zValidator('json', Schemas.updateAddressBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const address = await AddressLogic.editUserAddress(
			c,
			c.req.param('id'),
			body
		);
		return c.json({ address });
	}
);

currentUser.delete('/delivery-addresses/:id', async c => {
	await AddressLogic.deleteUserAddress(c, c.req.param('id'));
	return c.body(null, 204);
});

currentUser.get('/orders/:id', async c => {
	const id = c.req.param('id');

	const order = await OrderLogic.getOrderById(c, id);

	return c.json({ order });
});

currentUser.post(
	'/orders',
	requireFullAccount,
	zValidator('json', Schemas.createOrderSchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const result = await OrderLogic.createOrder(c, body);

		return c.json({
			order: result.order,
			cardAuthorizationData: result.cardAuthorizationData
		});
	}
);

currentUser.post('/orders/:id/confirm-pickup', async c => {
	const id = c.req.param('id');

	const order = await OrderLogic.confirmPickup(c, id);
	return c.json({ order });
});

currentUser.post(
	'/cards/authorize',
	zValidator('json', Schemas.authorizeCardBodySchema, zodHook),
	async c => {
		const { orderId } = c.req.valid('json');

		if (!orderId) {
			throw new HTTPException(400, { message: 'Order ID is required' });
		}

		const result = await CardLogic.authorizeCard(c, { orderId });
		return c.json(result);
	}
);

currentUser.delete('/cards/:cardId', async c => {
	const cardId = c.req.param('cardId');

	await CardLogic.deleteCard(c, { cardId });
	return c.body(null, 204);
});

currentUser.get('/watchlist', async c => {
	const user = await c.var.prisma.user
		.findUnique({ where: { id: c.var.auth!.id } })
		.watchlist({
			include: {
				product: {
					include: { store: true, images: true }
				}
			}
		});
	return c.json({ watchlist: user ?? [] });
});

currentUser.post(
	'/watchlist',
	zValidator('json', Schemas.addToWatchlistBodySchema, zodHook),
	async c => {
		const { productId } = c.req.valid('json');
		const item = await ProductLogic.addToWatchlist(c, { productId });
		return c.json({ watchlistProduct: item });
	}
);

currentUser.get('/push-tokens', async c => {
	const pushTokens = await c.var.prisma.userPushToken.findMany({
		where: { userId: c.var.auth!.id }
	});
	return c.json({ pushTokens });
});

currentUser.post(
	'/push-tokens',
	zValidator('json', Schemas.savePushTokenBodySchema, zodHook),
	async c => {
		const { token, type } = c.req.valid('json');

		const pushToken = await c.var.prisma.userPushToken.upsert({
			where: {
				userId_token: { userId: c.var.auth!.id, token }
			},
			update: { type },
			create: {
				token,
				type,
				user: { connect: { id: c.var.auth!.id } }
			}
		});

		return c.json({ pushToken });
	}
);

currentUser.delete(
	'/push-tokens/:token',
	zValidator('json', Schemas.deletePushTokenBodySchema, zodHook),
	async c => {
		const { type } = c.req.valid('json');

		const pushToken = await c.var.prisma.userPushToken.delete({
			where: {
				userId_token: {
					userId: c.var.auth!.id,
					token: c.req.param('token')
				},
				type
			}
		});

		return c.json({ pushToken });
	}
);

currentUser.get('/sessions', async c => {
	const sessions = await SessionData.getUserSessions(
		c.var.prisma,
		c.var.auth!.id
	);

	return c.json({ sessions });
});

currentUser.delete('/sessions', async c => {
	const sessions = await SessionData.getUserSessions(
		c.var.prisma,
		c.var.auth!.id
	);

	await SessionData.revokeUserSessions(c.var.prisma, c.var.auth!.id);
	await Promise.all(
		sessions.map(s => SessionData.denySession(c.var.redis, s.id))
	);

	return c.json({ message: 'All sessions revoked' });
});

currentUser.delete('/sessions/:id', async c => {
	const id = c.req.param('id');

	const session = await SessionData.getSessionById(c.var.prisma, id);

	if (!session || session.userId !== c.var.auth!.id) {
		throw new HTTPException(404, { message: 'Session not found' });
	}

	await SessionData.revokeSession(c.var.prisma, id);
	await SessionData.denySession(c.var.redis, id);

	return c.json({ message: 'Session revoked' });
});

export default currentUser;
