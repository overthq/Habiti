import { describe, expect, test } from 'bun:test';

import { resolveLogFormat } from './logger';

describe('resolveLogFormat', () => {
	test('LOG_FORMAT=json overrides NODE_ENV', () => {
		expect(resolveLogFormat('json', undefined)).toBe('json');
		expect(resolveLogFormat('json', 'development')).toBe('json');
		expect(resolveLogFormat('json', 'production')).toBe('json');
	});

	test('LOG_FORMAT=pretty overrides NODE_ENV', () => {
		expect(resolveLogFormat('pretty', undefined)).toBe('pretty');
		expect(resolveLogFormat('pretty', 'production')).toBe('pretty');
	});

	test('production is JSON when LOG_FORMAT is unset', () => {
		expect(resolveLogFormat(undefined, 'production')).toBe('json');
	});

	test('any other NODE_ENV is pretty when LOG_FORMAT is unset', () => {
		expect(resolveLogFormat(undefined, undefined)).toBe('pretty');
		expect(resolveLogFormat(undefined, 'development')).toBe('pretty');
		expect(resolveLogFormat(undefined, 'test')).toBe('pretty');
	});
});
