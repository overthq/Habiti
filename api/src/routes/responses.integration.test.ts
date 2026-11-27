import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

import prisma from '../config/prisma';
import { ProductStatus } from '../generated/prisma/client';
import { createTestApp } from '../test/helpers';

// Runs against real Postgres, because the global omit in `config/prisma` only
// applies to the real client. Skipped when no database is configured.

const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const SUFFIX = `responses-it-${Date.now()}`;
const USER_ID = `user-${SUFFIX}`;
const STORE_ID = `store-${SUFFIX}`;
const PRODUCT_ID = `product-${SUFFIX}`;

const FORBIDDEN_KEYS = [
	'passwordHash',
	'appleId',
	'authorizationCode',
	'signature',
	'unrealizedRevenue',
	'realizedRevenue',
	'paidOut',
	'pendingPayouts',
	'orderCount'
];

const findForbiddenKeys = (value: unknown, path = '$'): string[] => {
	if (Array.isArray(value)) {
		return value.flatMap((item, i) => findForbiddenKeys(item, `${path}[${i}]`));
	}

	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, child]) => [
			...(FORBIDDEN_KEYS.includes(key) ? [`${path}.${key}`] : []),
			...findForbiddenKeys(child, `${path}.${key}`)
		]);
	}

	return [];
};

suite('public responses', () => {
	const { app } = createTestApp({ prisma });

	beforeAll(async () => {
		await prisma.user.create({
			data: {
				id: USER_ID,
				name: 'Reviewer',
				email: `${SUFFIX}@example.com`,
				appleId: `apple-${SUFFIX}`,
				passwordHash: 'hash'
			}
		});

		await prisma.store.create({
			data: {
				id: STORE_ID,
				name: `Store ${SUFFIX}`,
				orderCount: 12,
				realizedRevenue: 500_000n,
				unrealizedRevenue: 100_000n,
				products: {
					create: {
						id: PRODUCT_ID,
						name: `Product ${SUFFIX}`,
						description: 'A product',
						unitPrice: 10_000,
						quantity: 5,
						status: ProductStatus.Active,
						reviews: { create: { userId: USER_ID, rating: 5, body: 'Great' } }
					}
				}
			}
		});
	});

	afterAll(async () => {
		await prisma.product.deleteMany({ where: { id: PRODUCT_ID } });
		await prisma.store.deleteMany({ where: { id: STORE_ID } });
		await prisma.user.deleteMany({ where: { id: USER_ID } });
	});

	test.each([
		`/stores/${STORE_ID}`,
		`/stores/${STORE_ID}/products`,
		`/products/${PRODUCT_ID}`,
		`/products/${PRODUCT_ID}/reviews`,
		`/products/${PRODUCT_ID}/related`,
		`/search?query=${SUFFIX}`,
		'/landing/highlights'
	])('GET %s exposes no sensitive fields', async path => {
		const res = await app.fetch(new Request(`http://test.local${path}`));

		expect(res.status).toBe(200);
		expect(findForbiddenKeys(await res.json())).toEqual([]);
	});

	test('reviews only carry the reviewer id and name', async () => {
		const res = await app.fetch(
			new Request(`http://test.local/products/${PRODUCT_ID}`)
		);
		const { product } = await res.json();

		expect(product.reviews[0].user).toEqual({ id: USER_ID, name: 'Reviewer' });
	});
});
