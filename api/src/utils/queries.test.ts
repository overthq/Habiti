import { describe, expect, test } from 'bun:test';
import { HTTPException } from 'hono/http-exception';

import { hydrateQuery } from './queries';

describe('hydrateQuery', () => {
	const allowedFields = ['status', 'storeId'] as const;
	const allowedOrderBy = ['createdAt'] as const;

	test('returns empty when no filter or orderBy is provided', () => {
		const result = hydrateQuery({}, { allowedFields, allowedOrderBy });
		expect(result).toEqual({});
	});

	test('shapes a single filter clause', () => {
		const result = hydrateQuery(
			{ filter: { status: { equals: 'Pending' } } },
			{ allowedFields, allowedOrderBy }
		);
		expect(result).toEqual({
			where: { status: { equals: 'Pending' } }
		});
	});

	test('rejects unknown fields with HTTPException(400)', () => {
		expect(() =>
			hydrateQuery(
				{ filter: { somethingMalicious: { equals: 1 } } },
				{ allowedFields, allowedOrderBy }
			)
		).toThrow(HTTPException);

		try {
			hydrateQuery(
				{ filter: { somethingMalicious: { equals: 1 } } },
				{ allowedFields, allowedOrderBy }
			);
		} catch (err) {
			expect(err).toBeInstanceOf(HTTPException);
			expect((err as HTTPException).status).toBe(400);
			expect((err as HTTPException).message).toBe('Invalid query');
		}
	});

	test('rejects unknown filter operators', () => {
		expect(() =>
			hydrateQuery(
				{ filter: { status: { regex: '.*' } } },
				{ allowedFields, allowedOrderBy }
			)
		).toThrow(HTTPException);
	});

	test('rejects orderBy fields outside the allowlist', () => {
		expect(() =>
			hydrateQuery(
				{ orderBy: { createdAt: 'asc', leakyField: 'desc' } },
				{ allowedFields, allowedOrderBy }
			)
		).toThrow(HTTPException);
	});

	test('rejects orderBy directions other than asc/desc', () => {
		expect(() =>
			hydrateQuery(
				{ orderBy: { createdAt: 'sideways' } },
				{ allowedFields, allowedOrderBy }
			)
		).toThrow(HTTPException);
	});

	test('shapes filter + orderBy together', () => {
		const result = hydrateQuery(
			{
				filter: { storeId: { equals: 'abc' } },
				orderBy: { createdAt: 'desc' }
			},
			{ allowedFields, allowedOrderBy }
		);
		expect(result).toEqual({
			where: { storeId: { equals: 'abc' } },
			orderBy: { createdAt: 'desc' }
		});
	});

	test('throws synchronously when allowedFields is empty (caller mistake)', () => {
		expect(() =>
			hydrateQuery({}, { allowedFields: [], allowedOrderBy: [] })
		).toThrow();
	});
});
