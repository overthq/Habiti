import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const apiRoot = path.resolve(import.meta.dir, '../..');

const requiredEnv = {
	JWT_SECRET: 'test-secret',
	CLOUDINARY_CLOUD_NAME: 'test',
	CLOUDINARY_API_KEY: 'test',
	CLOUDINARY_API_SECRET: 'test',
	PAYSTACK_SECRET_KEY: 'test'
};

const runProbe = (
	script: string,
	overrides: Record<string, string | undefined>
) => {
	const env: Record<string, string> = {};

	for (const [key, value] of Object.entries({
		...process.env,
		...requiredEnv,
		...overrides
	})) {
		if (typeof value === 'string') env[key] = value;
	}

	const result = spawnSync(process.execPath, ['-e', script], {
		cwd: apiRoot,
		env,
		encoding: 'utf8',
		timeout: 20_000
	});

	const probeLine = result.stderr
		.split('\n')
		.reverse()
		.find(line => line.startsWith('PROBE '));

	return {
		status: result.status,
		stdout: result.stdout,
		stderr: result.stderr,
		probe: probeLine ? JSON.parse(probeLine.slice('PROBE '.length)) : null
	};
};

const unsetScript = `
import { getClient } from '@sentry/bun';
import './src/config/sentry.ts';
import { rootLogger } from './src/services/logger.ts';

rootLogger.debug({ requestId: 'req-stdout' }, 'stdout_debug');
rootLogger.info(
	{ requestId: 'req-stdout', account: { password: 'secret' } },
	'stdout_only'
);
console.error('PROBE ' + JSON.stringify({ initialized: Boolean(getClient()) }));
`;

const forwardScript = `
import './src/config/sentry.ts';
import * as Sentry from '@sentry/bun';
import { rootLogger } from './src/services/logger.ts';

const client = Sentry.getClient();
const captured = [];
client.on('afterCaptureLog', log => {
	captured.push({
		level: log.level,
		message: typeof log.message === 'string' ? log.message : String(log.message),
		attributes: log.attributes ?? {}
	});
});

const sentLogs = [];
const transport = client.getTransport();
transport.send = async envelope => {
	for (const item of envelope[1] ?? []) {
		const payload = item[1];
		if (!payload || !Array.isArray(payload.items)) continue;
		for (const log of payload.items) {
			sentLogs.push({ body: log.body, trace_id: log.trace_id ?? null });
		}
	}
	return {};
};

rootLogger.trace('forward_trace');
rootLogger.debug('forward_debug');
rootLogger.child({
	requestId: 'req-1',
	traceId: 'trace-1',
	userId: 'user-1',
	storeId: 'store-1'
}).info({ account: { password: 'secret' } }, 'forward_info');
rootLogger.warn('forward_warn');
rootLogger.error('forward_error');
rootLogger.fatal('forward_fatal');

let span = null;
await Sentry.startSpan({ name: 'probe-span' }, async () => {
	const active = Sentry.getActiveSpan();
	const context = active?.spanContext();
	rootLogger.info('forward_in_span');
	span = {
		traceId: context?.traceId ?? null,
		spanId: context?.spanId ?? null
	};
});

await Sentry.flush(1_000);
const inSpan = sentLogs.find(entry => entry.body === 'forward_in_span');
console.error('PROBE ' + JSON.stringify({
	initialized: true,
	names: client.getOptions().integrations.map(integration => integration.name),
	enableLogs: client.getOptions().enableLogs,
	captured,
	span,
	inSpanTraceId: inSpan?.trace_id ?? null
}));
process.exit(0);
`;

describe('sentry pino log forwarding', () => {
	test('without SENTRY_DSN, logging stays on stdout and Sentry stays off', () => {
		const { status, stdout, stderr, probe } = runProbe(unsetScript, {
			SENTRY_DSN: undefined,
			LOG_LEVEL: 'info',
			NODE_ENV: 'production'
		});

		expect(status, stderr).toBe(0);
		expect(probe.initialized).toBe(false);
		expect(stdout).toContain('"level":"info"');
		expect(stdout).toContain('stdout_only');
		expect(stdout).toContain('req-stdout');
		expect(stdout).toContain('[REDACTED]');
		expect(stdout).not.toContain('secret');
		expect(stdout).not.toContain('stdout_debug');
	});

	test('with a DSN, info and above are forwarded and stdout is unchanged', () => {
		const { status, stdout, stderr, probe } = runProbe(forwardScript, {
			SENTRY_DSN: 'https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@127.0.0.1:9/1',
			LOG_LEVEL: 'trace',
			NODE_ENV: 'production'
		});

		expect(status, stderr).toBe(0);
		expect(probe.initialized).toBe(true);
		expect(probe.enableLogs).toBe(true);
		expect(probe.names).toContain('Pino');
		expect(probe.names).toContain('Http');
		expect(probe.names).toContain('Prisma');

		const messages = probe.captured.map(
			(entry: { message: string }) => entry.message
		);
		expect(messages).toEqual([
			'forward_info',
			'forward_warn',
			'forward_error',
			'forward_fatal',
			'forward_in_span'
		]);

		const info = probe.captured[0];
		expect(info.level).toBe('info');
		expect(info.attributes.requestId).toBe('req-1');
		expect(info.attributes.traceId).toBe('trace-1');
		expect(info.attributes.userId).toBe('user-1');
		expect(info.attributes.storeId).toBe('store-1');
		expect(info.attributes.account.password).toBe('[REDACTED]');
		expect(info.attributes.service).toBe('habiti-api');

		expect(stdout).toContain('"level":"info"');
		expect(stdout).toContain('forward_info');
		expect(stdout).toContain('forward_debug');
		expect(stdout).toContain('forward_trace');
		expect(stdout).not.toContain('secret');
	});

	test('pretty dev logs still forward when a DSN is set', () => {
		const { status, stdout, stderr, probe } = runProbe(forwardScript, {
			SENTRY_DSN: 'https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@127.0.0.1:9/1',
			LOG_LEVEL: 'trace',
			NODE_ENV: 'development'
		});

		expect(status, stderr).toBe(0);
		expect(probe.names).toContain('Pino');
		expect(
			probe.captured.map((entry: { message: string }) => entry.message)
		).toContain('forward_info');
		expect(
			probe.captured.map((entry: { message: string }) => entry.message)
		).not.toContain('forward_debug');
		expect(stdout).toContain('forward_info');
		expect(probe.inSpanTraceId).toBe(probe.span.traceId);
	});
});
