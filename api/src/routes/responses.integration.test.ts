import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

import prisma from '../config/prisma';
import { ProductStatus } from '../generated/prisma/client';
import { AccessTokenRole } from '../core/logic/auth';
import { authedRequest, createTestApp, signAccessToken } from '../test/helpers';

// Runs against real Postgres, because the global omit in `config/prisma` and
// the selects in `core/data/shapes` only apply to the real client. Skipped
// when no database is configured.

const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const SUFFIX = `responses-it-${Date.now()}`;
const SHOPPER_ID = `shopper-${SUFFIX}`;
const MANAGER_ID = `manager-${SUFFIX}`;
const STORE_ID = `store-${SUFFIX}`;
const PRODUCT_ID = `product-${SUFFIX}`;
const ORDER_ID = `order-${SUFFIX}`;
const CART_ID = `cart-${SUFFIX}`;

const NEVER_SENT = [
	'passwordHash',
	'appleId',
	'authorizationCode',
	'signature',
	'bin',
	'recipientRef',
	'pushTokens',
	'_count'
];

const ADMIN_ONLY = [
	'publicId',
	'suspended',
	'unrealizedRevenue',
	'realizedRevenue',
	'paidOut',
	'pendingPayouts',
	'orderCount'
];

const findKeys = (value: unknown, keys: string[], path = '$'): string[] => {
	if (Array.isArray(value)) {
		return value.flatMap((item, i) => findKeys(item, keys, `${path}[${i}]`));
	}

	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, child]) => [
			...(keys.includes(key) ? [`${path}.${key}`] : []),
			...findKeys(child, keys, `${path}.${key}`)
		]);
	}

	return [];
};

suite('response shapes', () => {
	const { app } = createTestApp({ prisma });

	const get = async (path: string, token?: string) => {
		const res = await app.fetch(
			token
				? authedRequest(path, token)
				: new Request(`http://test.local${path}`)
		);

		expect(res.status).toBe(200);

		return res.json();
	};

	const shopperToken = () =>
		signAccessToken({ userId: SHOPPER_ID, name: 'Shopper' });
	const managerToken = () =>
		signAccessToken({ userId: MANAGER_ID, name: 'Manager', storeId: STORE_ID });
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	beforeAll(async () => {
		await prisma.user.createMany({
			data: [
				{
					id: SHOPPER_ID,
					name: 'Shopper',
					email: `shopper-${SUFFIX}@example.com`,
					appleId: `apple-${SUFFIX}`,
					passwordHash: 'hash'
				},
				{
					id: MANAGER_ID,
					name: 'Manager',
					email: `manager-${SUFFIX}@example.com`
				}
			]
		});

		await prisma.store.create({
			data: {
				id: STORE_ID,
				name: `Store ${SUFFIX}`,
				orderCount: 12,
				realizedRevenue: 500_000n,
				unrealizedRevenue: 100_000n,
				image: { create: { path: 'store.png', publicId: 'store-public-id' } },
				managers: { create: { managerId: MANAGER_ID } },
				followers: { create: { followerId: SHOPPER_ID } },
				payoutAccounts: {
					create: {
						accountNumber: '0123456789',
						bankCode: '058',
						recipientRef: `RCP_${SUFFIX}`,
						isDefault: true
					}
				},
				products: {
					create: {
						id: PRODUCT_ID,
						name: `Product ${SUFFIX}`,
						description: 'A product',
						unitPrice: 10_000,
						quantity: 3,
						status: ProductStatus.Active,
						images: {
							create: { path: 'product.png', publicId: 'product-public-id' }
						},
						reviews: {
							create: { userId: SHOPPER_ID, rating: 5, body: 'Great' }
						}
					}
				}
			}
		});

		await prisma.card.create({
			data: {
				userId: SHOPPER_ID,
				email: `shopper-${SUFFIX}@example.com`,
				authorizationCode: 'AUTH_secret',
				signature: `SIG_${SUFFIX}`,
				bin: '408408',
				last4: '4081',
				expMonth: '12',
				expYear: '2030',
				bank: 'Test Bank',
				cardType: 'visa',
				countryCode: 'NG'
			}
		});

		await prisma.cart.create({
			data: {
				id: CART_ID,
				userId: SHOPPER_ID,
				storeId: STORE_ID,
				products: { create: { productId: PRODUCT_ID, quantity: 1 } }
			}
		});

		await prisma.order.create({
			data: {
				id: ORDER_ID,
				serialNumber: 1,
				userId: SHOPPER_ID,
				storeId: STORE_ID,
				total: 10_000,
				products: {
					create: { productId: PRODUCT_ID, unitPrice: 10_000, quantity: 1 }
				}
			}
		});

		await prisma.watchlistProduct.create({
			data: { userId: SHOPPER_ID, productId: PRODUCT_ID }
		});

		await prisma.userPushToken.create({
			data: { userId: SHOPPER_ID, token: `push-${SUFFIX}`, type: 'Shopper' }
		});
	});

	afterAll(async () => {
		await prisma.orderProduct.deleteMany({ where: { orderId: ORDER_ID } });
		await prisma.order.deleteMany({ where: { id: ORDER_ID } });
		await prisma.product.deleteMany({ where: { storeId: STORE_ID } });
		await prisma.store.deleteMany({ where: { id: STORE_ID } });
		await prisma.user.deleteMany({
			where: { id: { in: [SHOPPER_ID, MANAGER_ID] } }
		});
	});

	test.each([
		`/stores/${STORE_ID}`,
		`/stores/${STORE_ID}/products`,
		`/products/${PRODUCT_ID}`,
		`/products/${PRODUCT_ID}/reviews`,
		`/products/${PRODUCT_ID}/related`,
		`/search?query=${SUFFIX}`,
		'/landing/highlights'
	])('public GET %s', async path => {
		const body = await get(path);

		expect(findKeys(body, [...NEVER_SENT, ...ADMIN_ONLY, 'email'])).toEqual([]);
	});

	test.each([
		'/users/current',
		'/users/current/orders',
		`/users/current/orders/${ORDER_ID}`,
		'/users/current/carts',
		`/users/current/carts/${CART_ID}`,
		`/carts/${CART_ID}`,
		'/users/current/cards',
		'/users/current/watchlist',
		'/users/current/followed-stores'
	])('shopper GET %s', async path => {
		const body = await get(path, await shopperToken());

		expect(findKeys(body, [...NEVER_SENT, ...ADMIN_ONLY])).toEqual([]);
	});

	test.each([
		'/stores/current',
		'/stores/current/products',
		`/stores/current/products/${PRODUCT_ID}`,
		'/stores/current/overview',
		'/stores/current/orders',
		`/stores/current/orders/${ORDER_ID}`,
		'/stores/current/managers',
		`/stores/current/customers/${SHOPPER_ID}`,
		'/stores/current/payout-accounts',
		'/stores/current/transactions'
	])('store manager GET %s', async path => {
		const body = await get(path, await managerToken());

		// Managers only ever see a customer's (or co-manager's) name.
		expect(findKeys(body, [...NEVER_SENT, ...ADMIN_ONLY, 'email'])).toEqual([]);
	});

	test.each([
		'/admin/stores',
		`/admin/stores/${STORE_ID}`,
		`/admin/stores/${STORE_ID}/managers`,
		`/admin/stores/${STORE_ID}/orders`,
		`/admin/stores/${STORE_ID}/payout-accounts`,
		'/admin/products',
		`/admin/products/${PRODUCT_ID}`,
		'/admin/orders',
		`/admin/orders/${ORDER_ID}`,
		'/admin/users',
		`/admin/users/${SHOPPER_ID}`,
		`/admin/users/${MANAGER_ID}/stores`
	])('admin GET %s', async path => {
		const body = await get(path, await adminToken());

		expect(findKeys(body, NEVER_SENT)).toEqual([]);
	});

	test('reviews only carry the reviewer id and name', async () => {
		const { product } = await get(`/products/${PRODUCT_ID}`);

		expect(product.reviews[0].user).toEqual({
			id: SHOPPER_ID,
			name: 'Shopper'
		});
	});

	test('store orders only carry the customer id and name', async () => {
		const { order } = await get(
			`/stores/current/orders/${ORDER_ID}`,
			await managerToken()
		);

		expect(order.user).toEqual({ id: SHOPPER_ID, name: 'Shopper' });
	});

	test('admin sees store finances and image public ids', async () => {
		const { store } = await get(
			`/admin/stores/${STORE_ID}`,
			await adminToken()
		);

		expect(store).toMatchObject({
			followerCount: 1,
			realizedRevenue: 500_000,
			orderCount: 12,
			image: { publicId: 'store-public-id' }
		});
		expect(store.products[0].images[0].publicId).toBe('product-public-id');
	});
});
