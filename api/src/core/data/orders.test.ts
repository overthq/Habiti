import { describe, expect, test, mock } from 'bun:test';

import { decrementProductQuantities } from './orders';
import { LogicError, LogicErrorCode } from '../logic/errors';

/**
 * `decrementProductQuantities` runs inside a `prisma.$transaction(...)` and
 * relies on `updateMany({ where: { quantity: { gte: q } } })` returning
 * `count: 0` to detect insufficient stock. We mock the Prisma transaction
 * client to verify the contract; full DB-driven concurrency tests live in
 * the integration suite.
 */

const fakeTx = (updateManyImpl: (args: any) => Promise<{ count: number }>) => ({
	product: {
		updateMany: mock(updateManyImpl),
		findMany: mock(async () => [])
	}
});

describe('decrementProductQuantities', () => {
	test('decrements when stock is sufficient', async () => {
		const tx = fakeTx(async () => ({ count: 1 }));
		await decrementProductQuantities(tx as any, {
			products: [{ productId: 'p1', quantity: 3 }]
		});

		expect(tx.product.updateMany).toHaveBeenCalledTimes(1);
		const [args] = tx.product.updateMany.mock.calls[0]!;
		expect(args.where).toEqual({ id: 'p1', quantity: { gte: 3 } });
		expect(args.data).toEqual({ quantity: { decrement: 3 } });
	});

	test('throws ProductInsufficientStock when updateMany matches no rows', async () => {
		const tx = fakeTx(async () => ({ count: 0 }));

		let thrown: unknown;
		try {
			await decrementProductQuantities(tx as any, {
				products: [{ productId: 'p1', quantity: 5 }]
			});
		} catch (err) {
			thrown = err;
		}

		expect(thrown).toBeInstanceOf(LogicError);
		expect((thrown as LogicError).code).toBe(
			LogicErrorCode.ProductInsufficientStock
		);
	});

	test('throws on the first insufficient product even with later valid ones', async () => {
		let call = 0;
		const tx = fakeTx(async () => {
			call += 1;
			return { count: call === 1 ? 0 : 1 };
		});

		let thrown: unknown;
		try {
			await decrementProductQuantities(tx as any, {
				products: [
					{ productId: 'p1', quantity: 5 },
					{ productId: 'p2', quantity: 1 }
				]
			});
		} catch (err) {
			thrown = err;
		}

		expect(thrown).toBeInstanceOf(LogicError);
		// Loops short-circuits on the first failure — only one updateMany call.
		expect(tx.product.updateMany).toHaveBeenCalledTimes(1);
	});
});
