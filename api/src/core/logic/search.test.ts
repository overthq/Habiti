import { describe, expect, test, mock } from 'bun:test';

import { globalSearch } from './search';

/**
 * `globalSearch` is reachable with `optionalAuth`, so unauthenticated and
 * regular-user requests both land here with `isAdmin: false`. Only admins may
 * see unlisted stores (and their products) in results.
 */

const fakeContext = (isAdmin: boolean) => {
	const prisma = {
		product: {
			findMany: mock(async (_args: { where: Record<string, any> }) => [])
		},
		store: {
			findMany: mock(async (_args: { where: Record<string, any> }) => [])
		}
	};

	return {
		ctx: { var: { prisma, isAdmin } },
		productWhere: () => prisma.product.findMany.mock.calls[0]![0].where,
		storeWhere: () => prisma.store.findMany.mock.calls[0]![0].where
	};
};

describe('globalSearch', () => {
	test('excludes unlisted stores and their products for non-admins', async () => {
		const { ctx, productWhere, storeWhere } = fakeContext(false);
		await globalSearch(ctx as any, 'shoes');

		expect(productWhere().store).toEqual({ unlisted: false });
		expect(storeWhere().unlisted).toBe(false);
	});

	test('includes unlisted stores and their products for admins', async () => {
		const { ctx, productWhere, storeWhere } = fakeContext(true);
		await globalSearch(ctx as any, 'shoes');

		expect(productWhere().store).toBeUndefined();
		expect(storeWhere().unlisted).toBeUndefined();
	});
});
