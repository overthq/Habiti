export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const isOk = <T, E>(
	result: Result<T, E>
): result is { ok: true; data: T } => result.ok;

export const isErr = <T, E>(
	result: Result<T, E>
): result is { ok: false; error: E } => !result.ok;
