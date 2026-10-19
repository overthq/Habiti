import { describe, expect, test } from 'bun:test';
import type { MiddlewareHandler } from 'hono';
import pino from 'pino';

import { authedRequest, createTestApp, signAccessToken } from '../test/helpers';
import type { Logger } from '../services/logger';
import { rootLogger } from '../services/logger';
import type { AppEnv } from '../types/hono';
import { authenticate, optionalAuth } from './auth';
import { errorHandler } from './errorHandler';
import { resolveRequestTrace } from './logs';

const TRACEPARENT_RE = /^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i;

const incoming = `00-${'ab'.repeat(16)}-${'cd'.repeat(8)}-01`;

describe('resolveRequestTrace', () => {
	test('uses the active Sentry span instead of an inbound traceparent', () => {
		const traceId = 'a'.repeat(32);
		const spanId = 'b'.repeat(16);
		const resolved = resolveRequestTrace(incoming, {
			traceId,
			spanId,
			sampled: true
		});

		expect(resolved.traceId).toBe(traceId);
		expect(resolved.spanId).toBe(spanId);
		expect(resolved.traceparent).toBe(`00-${traceId}-${spanId}-01`);
	});

	test('writes flags 00 when the Sentry span is not sampled', () => {
		const resolved = resolveRequestTrace(undefined, {
			traceId: 'e'.repeat(32),
			spanId: 'f'.repeat(16),
			sampled: false
		});

		expect(resolved.traceparent.endsWith('-00')).toBe(true);
	});

	test('echoes a valid inbound traceparent when no Sentry span is active', () => {
		const resolved = resolveRequestTrace(incoming, undefined);

		expect(resolved.traceparent).toBe(incoming);
		expect(resolved.traceId).toBe('ab'.repeat(16));
		expect(resolved.spanId).toBe('cd'.repeat(8));
	});

	test('mints a traceparent when the inbound header is missing or invalid', () => {
		expect(resolveRequestTrace(undefined, undefined).traceparent).toMatch(
			TRACEPARENT_RE
		);

		const invalid = resolveRequestTrace('not-a-trace', undefined);
		expect(invalid.traceparent).toMatch(TRACEPARENT_RE);
		expect(invalid.traceparent).not.toBe('not-a-trace');
	});

	test('ignores a Sentry span whose ids are not W3C hex', () => {
		const resolved = resolveRequestTrace(incoming, {
			traceId: 'nope',
			spanId: 'also-nope',
			sampled: true
		});

		expect(resolved.traceparent).toBe(incoming);
	});
});

describe('logsMiddleware traceparent', () => {
	test('echoes an inbound traceparent when Sentry has no active span', async () => {
		const { app } = createTestApp();
		const res = await app.request('/health/live', {
			headers: { traceparent: incoming }
		});

		expect(res.status).toBe(200);
		expect(res.headers.get('traceparent')).toBe(incoming);
		expect(res.headers.get('x-request-id')).toBeTruthy();
	});

	test('mints a traceparent when the request has none', async () => {
		const { app } = createTestApp();
		const res = await app.request('/health/live');

		expect(res.status).toBe(200);
		expect(res.headers.get('traceparent')).toMatch(TRACEPARENT_RE);
	});
});

const countKey = (line: string, key: string) =>
	line.split(`"${key}"`).length - 1;

const captureRequestWrites = (logger: Logger, lines: string[]) => {
	const writeSym = pino.symbols.writeSym;
	const target = logger as unknown as Record<
		symbol,
		(this: Logger, obj: unknown, msg: unknown, num: number) => void
	>;
	const original = target[writeSym]!;
	const hadOwn = Object.prototype.hasOwnProperty.call(logger, writeSym);

	target[writeSym] = function (
		this: Logger,
		obj: unknown,
		msg: unknown,
		num: number
	) {
		const stream = (
			this as unknown as Record<symbol, { write: (chunk: string) => unknown }>
		)[pino.symbols.streamSym]!;
		const write = stream.write;

		stream.write = chunk => {
			lines.push(String(chunk));
			stream.write = write;

			return write.call(stream, chunk);
		};

		try {
			return original.call(this, obj, msg, num);
		} finally {
			if (stream.write !== write) stream.write = write;
		}
	};

	return () => {
		if (hadOwn) target[writeSym] = original;
		else delete target[writeSym];
	};
};

const lineWithMsg = (lines: string[], msg: string) => {
	const hits = lines.filter(line => {
		const parsed = JSON.parse(line) as { msg?: string };

		return parsed.msg === msg;
	});

	expect(hits).toHaveLength(1);

	const line = hits[0];

	if (!line) throw new Error(`missing ${msg}`);

	return { line, json: JSON.parse(line) as Record<string, unknown> };
};

const runProbe = async (
	request: Request,
	middleware: MiddlewareHandler<AppEnv>[] = []
) => {
	const { app } = createTestApp();
	const lines: string[] = [];
	let restore = () => {};

	app.get(
		'/log-probe',
		async (c, next) => {
			restore = captureRequestWrites(c.var.logger, lines);

			await next();
		},
		...middleware,
		c => {
			const parent = Object.getPrototypeOf(c.var.logger) as Logger;

			c.var.logger.info({ probe: true }, 'handler_probe');

			return c.json({
				rebound: parent.bindings().requestId === c.var.requestId
			});
		}
	);

	try {
		const res = await app.request(request);
		const body = (await res.json()) as { rebound?: boolean };

		return { res, body, lines };
	} finally {
		restore();
	}
};

const probeRequest = (
	requestId: string,
	headers: Record<string, string> = {}
) =>
	new Request('http://test.local/log-probe', {
		headers: {
			'x-request-id': requestId,
			traceparent: incoming,
			...headers
		}
	});

describe('request logger after auth', () => {
	test('an authenticated handler line and request_finished carry userId and storeId once', async () => {
		const token = await signAccessToken({
			userId: 'user-1',
			storeId: 'store-1'
		});
		const { res, body, lines } = await runProbe(
			authedRequest('/log-probe', token, {
				headers: {
					'x-request-id': 'req-auth-1',
					traceparent: incoming
				}
			}),
			[authenticate]
		);

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(true);
		expect(res.headers.get('x-request-id')).toBe('req-auth-1');
		expect(res.headers.get('traceparent')).toBe(incoming);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBe('user-1');
		expect(handler.json.storeId).toBe('store-1');
		expect(handler.json.requestId).toBe('req-auth-1');
		expect(handler.json.traceId).toBe('ab'.repeat(16));
		expect(handler.json.spanId).toBe('cd'.repeat(8));
		expect(finished.json.userId).toBe('user-1');
		expect(finished.json.storeId).toBe('store-1');
		expect(finished.json.requestId).toBe(handler.json.requestId);
		expect(finished.json.traceId).toBe(handler.json.traceId);
		expect(finished.json.spanId).toBe(handler.json.spanId);
		expect(finished.json.status).toBe(200);
		expect(finished.json.route).toBe('/log-probe');

		for (const entry of [handler, finished]) {
			expect(countKey(entry.line, 'requestId')).toBe(1);
			expect(countKey(entry.line, 'traceId')).toBe(1);
			expect(countKey(entry.line, 'userId')).toBe(1);
			expect(countKey(entry.line, 'storeId')).toBe(1);
		}
	});

	test('running auth twice does not duplicate requestId, userId, or storeId', async () => {
		const token = await signAccessToken({
			userId: 'user-1',
			storeId: 'store-1'
		});
		const { res, body, lines } = await runProbe(
			authedRequest('/log-probe', token, {
				headers: {
					'x-request-id': 'req-auth-twice',
					traceparent: incoming
				}
			}),
			[authenticate, authenticate]
		);

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(true);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBe('user-1');
		expect(handler.json.storeId).toBe('store-1');
		expect(handler.json.requestId).toBe('req-auth-twice');
		expect(finished.json.requestId).toBe('req-auth-twice');
		expect(handler.json.traceId).toBe(finished.json.traceId);

		for (const entry of [handler, finished]) {
			expect(countKey(entry.line, 'requestId')).toBe(1);
			expect(countKey(entry.line, 'traceId')).toBe(1);
			expect(countKey(entry.line, 'userId')).toBe(1);
			expect(countKey(entry.line, 'storeId')).toBe(1);
		}
	});

	test('an authenticated request without a store claim ignores x-market-store-id', async () => {
		const token = await signAccessToken({ userId: 'user-2' });
		const { res, body, lines } = await runProbe(
			authedRequest('/log-probe', token, {
				headers: {
					'x-request-id': 'req-auth-2',
					traceparent: incoming,
					'x-market-store-id': 'store-header'
				}
			}),
			[authenticate]
		);

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(true);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBe('user-2');
		expect(handler.json.storeId).toBeUndefined();
		expect(finished.json.userId).toBe('user-2');
		expect(finished.json.storeId).toBeUndefined();
		expect(handler.json.requestId).toBe(finished.json.requestId);
		expect(handler.json.traceId).toBe(finished.json.traceId);
		expect(handler.line).not.toContain('store-header');
		expect(finished.line).not.toContain('store-header');
		expect(countKey(handler.line, 'requestId')).toBe(1);
		expect(countKey(handler.line, 'userId')).toBe(1);
	});

	test('optional auth with no token binds storeId from x-market-store-id only', async () => {
		const { res, body, lines } = await runProbe(
			probeRequest('req-guest', { 'x-market-store-id': 'store-guest' }),
			[optionalAuth]
		);

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(true);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBeUndefined();
		expect(handler.json.storeId).toBe('store-guest');
		expect(finished.json.userId).toBeUndefined();
		expect(finished.json.storeId).toBe('store-guest');
		expect(handler.json.requestId).toBe('req-guest');
		expect(finished.json.requestId).toBe('req-guest');
		expect(handler.json.traceId).toBe(finished.json.traceId);
		expect(countKey(handler.line, 'requestId')).toBe(1);
		expect(countKey(handler.line, 'storeId')).toBe(1);
		expect(countKey(finished.line, 'storeId')).toBe(1);
	});

	test('optional auth with no token and no store header does not rebind', async () => {
		const { res, body, lines } = await runProbe(probeRequest('req-anon'), [
			optionalAuth
		]);

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(false);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBeUndefined();
		expect(handler.json.storeId).toBeUndefined();
		expect(finished.json.userId).toBeUndefined();
		expect(finished.json.storeId).toBeUndefined();
		expect(handler.json.requestId).toBe('req-anon');
		expect(finished.json.requestId).toBe(handler.json.requestId);
		expect(handler.json.traceId).toBe(finished.json.traceId);
		expect(countKey(handler.line, 'requestId')).toBe(1);
		expect(countKey(finished.line, 'requestId')).toBe(1);
	});

	test('a public request keeps the pre-auth logger', async () => {
		const { res, body, lines } = await runProbe(probeRequest('req-public'));

		expect(res.status).toBe(200);
		expect(body.rebound).toBe(false);

		const handler = lineWithMsg(lines, 'handler_probe');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(handler.json.userId).toBeUndefined();
		expect(handler.json.storeId).toBeUndefined();
		expect(finished.json.userId).toBeUndefined();
		expect(finished.json.storeId).toBeUndefined();
		expect(handler.json.requestId).toBe('req-public');
		expect(handler.json.traceId).toBe('ab'.repeat(16));
		expect(finished.json.requestId).toBe(handler.json.requestId);
		expect(finished.json.traceId).toBe(handler.json.traceId);
		expect(res.headers.get('x-request-id')).toBe('req-public');
		expect(countKey(handler.line, 'requestId')).toBe(1);
	});

	test('a rejected token does not bind userId and still logs with requestId', async () => {
		const { res, lines } = await runProbe(probeRequest('req-denied'), [
			authenticate
		]);

		expect(res.status).toBe(401);

		const httpError = lineWithMsg(lines, 'http_error');
		const finished = lineWithMsg(lines, 'request_finished');

		expect(httpError.json.userId).toBeUndefined();
		expect(httpError.json.storeId).toBeUndefined();
		expect(httpError.json.requestId).toBe('req-denied');
		expect(httpError.json.traceId).toBe('ab'.repeat(16));
		expect(finished.json.userId).toBeUndefined();
		expect(finished.json.storeId).toBeUndefined();
		expect(finished.json.requestId).toBe('req-denied');
		expect(finished.json.traceId).toBe(httpError.json.traceId);
		expect(finished.json.status).toBe(401);
		expect(countKey(httpError.line, 'requestId')).toBe(1);
		expect(countKey(finished.line, 'requestId')).toBe(1);
	});

	test('errorHandler uses rootLogger when the request logger was never set', async () => {
		const lines: string[] = [];
		const restore = captureRequestWrites(rootLogger, lines);

		try {
			const res = await errorHandler(new Error('before_logs_boom'), {
				req: { method: 'GET', path: '/before-logs' },
				json: () => new Response(null, { status: 500 }),
				var: {}
			} as never);

			expect(res.status).toBe(500);
		} finally {
			restore();
		}

		const line = lines.find(entry => entry.includes('before_logs_boom'));

		expect(line).toBeDefined();

		const json = JSON.parse(line ?? '') as Record<string, unknown>;

		expect(json.msg).toBe('unexpected_error');
		expect(json.requestId).toBeUndefined();
		expect(json.userId).toBeUndefined();
		expect(json.storeId).toBeUndefined();
	});
});
