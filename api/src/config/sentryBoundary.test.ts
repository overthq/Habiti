import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve(import.meta.dir, '..');

/**
 * `@sentry/*` stays inside the bootstrap, the Sentry provider module, and
 * the error-reporting adapter. The tests next to those modules may import
 * it to assert that boundary.
 */
const allowed = new Set([
	'config/sentry.ts',
	'config/telemetry.ts',
	'services/errorReporting.ts',
	'config/sentry.test.ts',
	'config/telemetry.test.ts',
	'services/errorReporting.test.ts'
]);

const importRe = /(?:from\s+|require\(\s*)['"]@sentry\//;

const walk = (dir: string): string[] => {
	const files: string[] = [];

	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);

		if (statSync(full).isDirectory()) files.push(...walk(full));
		else if (entry.endsWith('.ts')) files.push(full);
	}

	return files;
};

describe('@sentry import boundary', () => {
	test('application code does not import @sentry', () => {
		const offenders: string[] = [];

		for (const file of walk(srcRoot)) {
			const rel = path.relative(srcRoot, file);

			if (allowed.has(rel)) continue;
			if (importRe.test(readFileSync(file, 'utf8'))) offenders.push(rel);
		}

		expect(offenders).toEqual([]);
	});
});
