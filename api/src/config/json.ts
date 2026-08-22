/**
 * `JSON.stringify` throws on `bigint`, and Prisma hands back `bigint` for every
 * money column on the ledger (`Store.realizedRevenue`, `LedgerEntry.amount`,
 * `StoreStatementEntry.balanceAfter`, ...). Any route that returns a raw row
 * containing one -- `include: { store: true }` is the common way in -- would
 * 500 inside `c.json()`.
 *
 * Every one of those columns is kobo, so a JS number holds them exactly up to
 * ~90 trillion naira. Serializing as `number` keeps the wire contract the
 * clients already expect (`apps/dashboard/src/data/types.ts` types balances as
 * `number`), while the server keeps using `bigint` for ledger arithmetic.
 *
 * Imported for side effects by `app.ts`, before any route can respond.
 */
declare global {
	interface BigInt {
		toJSON(): number;
	}
}

BigInt.prototype.toJSON = function () {
	const value = Number(this);

	if (!Number.isSafeInteger(value)) {
		throw new TypeError(
			`BigInt ${this.toString()} exceeds Number.MAX_SAFE_INTEGER and cannot be serialized without precision loss.`
		);
	}

	return value;
};

export {};
