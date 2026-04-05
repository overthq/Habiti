/**
 * Converts `{ key: T | undefined }` to `{ key?: T }` at the type level.
 * Used at the Prisma boundary where `exactOptionalPropertyTypes`
 * makes `T | undefined` not assignable to optional properties.
 *
 * Safe because Prisma skips `undefined` values at runtime.
 */
export type StripUndefined<T> = {
	[K in keyof T]: Exclude<T[K], undefined>;
};
