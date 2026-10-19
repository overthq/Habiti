import { describe, expect, spyOn, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

import * as Sentry from '@sentry/bun';

import { captureException } from './errorReporting';

const apiRoot = path.resolve(import.meta.dir, '../..');

describe('captureException', () => {
	test('does nothing when Sentry has not been initialised', () => {
		expect(Sentry.getClient()).toBeUndefined();

		const spy = spyOn(Sentry, 'captureException');

		expect(() =>
			captureException(new Error('boom'), {
				tags: { feature: 'payout' },
				extra: { account_number: '[REDACTED]' }
			})
		).not.toThrow();
		expect(spy).not.toHaveBeenCalled();

		spy.mockRestore();
	});

	test('forwards tags, extra, user, and context once Sentry is initialised', () => {
		const script = `
import './src/config/telemetry.ts';
import * as Sentry from '@sentry/bun';
import { captureException } from './src/services/errorReporting.ts';

const client = Sentry.getClient();
const events = [];
client.getTransport().send = async envelope => {
  for (const item of envelope[1] ?? []) {
    const header = item[0];
    if (header && header.type === 'event') events.push(item[1]);
  }
  return {};
};

const extra = { account_number: '[REDACTED]', operation: 'chargeAuthorization' };
captureException(new Error('paystack down'), {
  tags: { integration: 'paystack', operation: 'chargeAuthorization' },
  extra,
  user: { id: 'user-1', email: 'ada@example.com' },
  contexts: { request: { method: 'POST', path: '/payments' } }
});
await Sentry.flush(1_000);
console.error('PROBE ' + JSON.stringify({ events }));
process.exit(0);
`;

		const env: Record<string, string> = {};

		for (const [key, value] of Object.entries({
			...process.env,
			JWT_SECRET: 'test-secret',
			CLOUDINARY_CLOUD_NAME: 'test',
			CLOUDINARY_API_KEY: 'test',
			CLOUDINARY_API_SECRET: 'test',
			PAYSTACK_SECRET_KEY: 'test',
			REDIS_URL: 'redis://127.0.0.1:6379',
			SENTRY_DSN: 'https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@127.0.0.1:9/1',
			OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
			NODE_ENV: 'development'
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
		const probe = probeLine
			? JSON.parse(probeLine.slice('PROBE '.length))
			: null;

		expect(result.status, result.stderr).toBe(0);
		expect(probe.events).toHaveLength(1);

		const event = probe.events[0];
		expect(event.tags).toEqual({
			integration: 'paystack',
			operation: 'chargeAuthorization'
		});
		expect(event.extra.account_number).toBe('[REDACTED]');
		expect(event.extra.operation).toBe('chargeAuthorization');
		expect(event.user).toEqual({ id: 'user-1', email: 'ada@example.com' });
		expect(event.contexts.request).toEqual({
			method: 'POST',
			path: '/payments'
		});
		expect(JSON.stringify(event.extra)).not.toContain('AUTH_secret');
	});
});
