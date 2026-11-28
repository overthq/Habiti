import { $ } from 'bun';
import path from 'path';

import { urls } from '../e2e/ports';

type Service = {
	name: string;
	cwd: string;
	command: string;
	health: string;
	mobile?: boolean;
};

const ROOT = path.resolve(import.meta.dir, '..');

const DEV_SERVICES: Service[] = [
	{
		name: 'api',
		cwd: 'api',
		command: 'bun run dev',
		health: 'http://localhost:4000/health/live'
	},
	{
		name: 'paystack',
		cwd: 'api',
		command: 'bun run fake-paystack',
		health: 'http://localhost:4010/health'
	},
	{
		name: 'web',
		cwd: 'apps/web',
		command: 'bun run dev',
		health: 'http://localhost:3000'
	},
	{
		name: 'admin',
		cwd: 'apps/admin',
		command: 'bun run dev',
		health: 'http://localhost:3001'
	},
	{
		name: 'app',
		cwd: 'apps/app',
		command: 'bunx expo start --port 8081',
		health: 'http://localhost:8081/status',
		mobile: true
	},
	{
		name: 'dashboard',
		cwd: 'apps/dashboard',
		command: 'bunx expo start --port 8082',
		health: 'http://localhost:8082/status',
		mobile: true
	}
];

const E2E_SERVICES: Service[] = [
	{
		name: 'api',
		cwd: 'api',
		command: 'bun run dev:e2e',
		health: `${urls.api}/health/live`
	},
	{
		name: 'paystack',
		cwd: 'api',
		command: 'bun run fake-paystack:e2e',
		health: `${urls.paystack}/health`
	},
	{
		name: 'web',
		cwd: 'apps/web',
		command: 'bun run dev:e2e',
		health: urls.web
	},
	{
		name: 'admin',
		cwd: 'apps/admin',
		command: 'bun run dev:e2e',
		health: urls.admin
	},
	{
		name: 'dashboard',
		cwd: 'apps/dashboard',
		command: 'bun run start:e2e',
		health: `${urls.metro}/status`,
		mobile: true
	}
];

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};

const e2e = flag('--e2e');
const sessionLabel = e2e ? 'Habiti E2E' : 'Habiti';
const command =
	args.find(a => !a.startsWith('--') && a !== option('--only')) ?? 'up';
const only = option('--only')?.split(',');

const services = (e2e ? E2E_SERVICES : DEV_SERVICES).filter(
	s => (!only || only.includes(s.name)) && !(flag('--no-mobile') && s.mobile)
);

const isUp = async (url: string) => {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(1_500) });
		return res.status < 500;
	} catch {
		return false;
	}
};

const findSession = async (): Promise<string | undefined> => {
	const { sessions } = await $`rex ls --json`.json();
	return sessions.find((s: { label: string }) => s.label === sessionLabel)
		?.session_id;
};

const listTabs = async (sessionId: string) => {
	const { windows } = await $`rex window ls -s ${sessionId} --json`.json();
	return new Map<string, string>(
		windows.map((w: { label: string; focused_block_id: string }) => [
			w.label,
			w.focused_block_id
		])
	);
};

const run = async (sessionId: string, block: string, line: string) => {
	await $`rex send -s ${sessionId} -b ${block} ${line}`.quiet();
	await $`rex send-key -s ${sessionId} -b ${block} enter`.quiet();
};

const ensurePrerequisites = async () => {
	const redis = await $`redis-cli ping`.nothrow().quiet();
	if (redis.exitCode !== 0) {
		console.log('Starting Redis');
		await $`redis-server --daemonize yes`.quiet();
	}

	const postgres = await $`pg_isready -h localhost -q`.nothrow().quiet();
	if (postgres.exitCode !== 0) {
		const app = await $`open -Ra Postgres`.nothrow().quiet();
		if (app.exitCode !== 0) {
			throw new Error(
				'Postgres is not running on localhost:5432. Start it and try again.'
			);
		}

		console.log('Starting Postgres.app');
		await $`open -ga Postgres`.quiet();

		for (let i = 0; i < 20; i++) {
			if (
				(await $`pg_isready -h localhost -q`.nothrow().quiet()).exitCode === 0
			)
				return;
			await Bun.sleep(500);
		}

		throw new Error('Postgres.app did not start within 10 seconds');
	}
};

const up = async () => {
	await ensurePrerequisites();

	let sessionId = await findSession();
	const tabs = sessionId
		? await listTabs(sessionId)
		: new Map<string, string>();

	for (const service of services) {
		const cwd = path.join(ROOT, service.cwd);
		let block = tabs.get(service.name);

		if (block && (await isUp(service.health))) {
			console.log(`${service.name.padEnd(10)} already up`);
			continue;
		}

		if (!sessionId) {
			const created =
				await $`rex new ${sessionLabel} -c ${cwd} --window ${service.name} --json`.json();
			sessionId = created.session_id as string;
			block = created.initial_windows[0].block_ids[0] as string;
		} else if (!block) {
			const created =
				await $`rex window new -s ${sessionId} ${service.name} -c ${cwd} --focus=false --json`.json();
			block = created.block_ids[0] as string;
		} else {
			await $`rex send-key -s ${sessionId} -b ${block} ctrl+c`.quiet();
			await Bun.sleep(300);
		}

		await run(sessionId, block!, service.command);
		console.log(`${service.name.padEnd(10)} starting: ${service.command}`);
	}

	console.log(`\nWaiting for services in Rex session "${sessionLabel}"...`);

	const deadline = Date.now() + 120_000;
	const pending = new Set(services);

	while (pending.size > 0 && Date.now() < deadline) {
		for (const service of pending) {
			if (await isUp(service.health)) {
				console.log(`${service.name.padEnd(10)} up   ${service.health}`);
				pending.delete(service);
			}
		}
		await Bun.sleep(1_000);
	}

	for (const service of pending) {
		console.log(
			`${service.name.padEnd(10)} DOWN ${service.health}  (see: bun stack logs ${service.name}${e2e ? ' --e2e' : ''})`
		);
	}

	if (pending.size > 0) process.exit(1);
};

const status = async () => {
	const sessionId = await findSession();
	console.log(`Rex session "${sessionLabel}": ${sessionId ?? 'not running'}`);

	for (const service of e2e ? E2E_SERVICES : DEV_SERVICES) {
		const state = (await isUp(service.health)) ? 'up  ' : 'down';
		console.log(`${service.name.padEnd(10)} ${state} ${service.health}`);
	}
};

const logs = async () => {
	const name = args.find(a => !a.startsWith('--') && a !== 'logs');
	const sessionId = await findSession();
	const block =
		sessionId && name ? (await listTabs(sessionId)).get(name) : undefined;

	if (!sessionId || !block) {
		throw new Error(`No "${name}" tab in Rex session "${sessionLabel}"`);
	}

	await $`rex capture -s ${sessionId} -b ${block} --trim --unwrap`;
};

const down = async () => {
	const sessionId = await findSession();

	if (!sessionId) {
		console.log(`Rex session "${sessionLabel}" is not running`);
		return;
	}

	await $`rex kill ${sessionId}`.quiet();
	console.log(`Closed Rex session "${sessionLabel}"`);
};

const commands: Record<string, () => Promise<void>> = {
	up,
	status,
	logs,
	down
};

if (!commands[command]) {
	console.error(
		`Unknown command "${command}". One of: ${Object.keys(commands).join(', ')}`
	);
	process.exit(1);
}

await commands[command]();
