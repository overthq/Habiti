import { $ } from 'bun';
import { readdirSync } from 'fs';
import path from 'path';

import { urls } from '../../../e2e/ports';
import { maestroVars, serveVerificationCodes } from './maestro';

const ROOT = path.resolve(import.meta.dir, '../../..');
const API_DIR = path.join(ROOT, 'api');
const FLOWS_DIR = path.join(import.meta.dir, 'flows');
const ARTIFACTS = path.join(ROOT, '.e2e-artifacts/dashboard');

const REQUIRED = [
	['api', `${urls.api}/health/live`],
	['paystack', `${urls.paystack}/health`],
	['metro', `${urls.metro}/status`]
] as const;

for (const [name, url] of REQUIRED) {
	const up = await fetch(url, { signal: AbortSignal.timeout(2_000) })
		.then(res => res.ok)
		.catch(() => false);

	if (!up) {
		console.error(
			`${name} is not running at ${url}. Start it with \`bun stack --e2e\`.`
		);
		process.exit(1);
	}
}

const flatten = (value: unknown, prefix = ''): Record<string, string> => {
	if (value === null || value === undefined) return {};

	if (typeof value !== 'object') {
		return { [prefix]: String(value) };
	}

	return Object.entries(value).reduce<Record<string, string>>(
		(vars, [key, child]) => ({
			...vars,
			...flatten(
				child,
				prefix ? `${prefix}_${key.toUpperCase()}` : key.toUpperCase()
			)
		}),
		{}
	);
};

const buildScenario = async (name: string) => {
	const output = await $`bun run --silent e2e scenario ${name}`
		.cwd(API_DIR)
		.text();
	const line = output.split('\n').find(l => l.startsWith('E2E_RESULT '));

	if (!line) throw new Error(`Scenario ${name} printed no result:\n${output}`);

	return flatten(JSON.parse(line.slice('E2E_RESULT '.length)));
};

const filters = process.argv.slice(2);
const flows = readdirSync(FLOWS_DIR)
	.filter(f => f.endsWith('.yaml'))
	.filter(f => filters.length === 0 || filters.some(word => f.includes(word)))
	.sort();

if (flows.length === 0) {
	console.error(`No flows match ${filters.join(', ')}`);
	process.exit(1);
}

await $`bun run db:reset:e2e`.cwd(API_DIR).quiet();

const codes = serveVerificationCodes();
const failures: string[] = [];

for (const flow of flows) {
	const file = path.join(FLOWS_DIR, flow);
	const header = (await Bun.file(file).text()).split('\n')[0];
	const scenarioName = header.match(/^# scenario: (\w+)/)?.[1];
	const vars = scenarioName ? await buildScenario(scenarioName) : {};
	const name = flow.replace(/\.yaml$/, '');

	console.log(`\n▸ ${name}${scenarioName ? ` (${scenarioName})` : ''}`);

	const envArgs = Object.entries({ ...maestroVars, ...vars }).flatMap(
		([k, v]) => ['-e', `${k}=${v}`]
	);
	const result =
		await $`maestro test ${envArgs} --test-output-dir ${path.join(ARTIFACTS, name)} --format junit --output ${path.join(ARTIFACTS, `${name}.xml`)} ${file}`
			.cwd(import.meta.dir)
			.nothrow();

	if (result.exitCode !== 0) failures.push(name);
}

codes.stop();

console.log(
	failures.length === 0
		? `\nAll ${flows.length} flows passed.`
		: `\n${failures.length} of ${flows.length} flows failed: ${failures.join(', ')}\nScreenshots and logs: ${ARTIFACTS}`
);

process.exit(failures.length === 0 ? 0 : 1);
