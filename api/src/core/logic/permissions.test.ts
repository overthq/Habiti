import { describe, expect, test } from 'bun:test';

import { assertStoreScope } from './permissions';
import { LogicError, LogicErrorCode } from './errors';

const context = (vars: Record<string, unknown>) => ({ var: vars }) as any;

const codeOf = (fn: () => unknown) => {
	try {
		fn();
	} catch (error) {
		return error instanceof LogicError ? error.code : 'not-a-LogicError';
	}

	return 'did-not-throw';
};

describe('assertStoreScope', () => {
	test('returns the claimed store when no target is named', () => {
		const c = context({ auth: { id: 'manager' }, storeId: 'store-1' });

		expect(assertStoreScope(c)).toEqual({
			storeId: 'store-1',
			userId: 'manager'
		});
	});

	test('accepts a target matching the claim', () => {
		const c = context({ auth: { id: 'manager' }, storeId: 'store-1' });

		expect(assertStoreScope(c, 'store-1').storeId).toBe('store-1');
	});

	test('rejects a target the claim does not name', () => {
		const c = context({ auth: { id: 'manager' }, storeId: 'store-1' });

		expect(codeOf(() => assertStoreScope(c, 'store-2'))).toBe(
			LogicErrorCode.Forbidden
		);
	});

	/**
	 * The guards this replaced read `if (c.var.storeId && …)`, so a caller with
	 * no store context skipped the comparison entirely and the undefined id
	 * carried on into a `where` clause -- which Prisma treats as "no filter".
	 */
	test('refuses a caller with no store context rather than passing it through', () => {
		const c = context({ auth: { id: 'someone' }, storeId: undefined });

		expect(codeOf(() => assertStoreScope(c, 'store-1'))).toBe(
			LogicErrorCode.StoreContextRequired
		);

		expect(codeOf(() => assertStoreScope(c))).toBe(
			LogicErrorCode.StoreContextRequired
		);
	});

	test('rejects an unauthenticated caller', () => {
		expect(codeOf(() => assertStoreScope(context({}), 'store-1'))).toBe(
			LogicErrorCode.NotAuthenticated
		);
	});

	test('lets an admin act on the store they name', () => {
		const c = context({ auth: { id: 'admin-1' }, isAdmin: true });

		expect(assertStoreScope(c, 'any-store')).toEqual({
			storeId: 'any-store',
			userId: 'admin-1'
		});
	});

	test('refuses an admin who names no store at all', () => {
		const c = context({ auth: { id: 'admin-1' }, isAdmin: true });

		expect(codeOf(() => assertStoreScope(c))).toBe(
			LogicErrorCode.StoreContextRequired
		);
	});
});
