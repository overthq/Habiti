import { $ } from 'bun';
import { randomBytes } from 'crypto';
import { existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
const at = (p: string) => path.join(ROOT, p);

const has = async (tool: string) =>
	(await $`command -v ${tool}`.nothrow().quiet()).exitCode === 0;

const step = (message: string) => console.log(`\n▸ ${message}`);

step('Checking tools');

const required = ['bun', 'redis-server', 'redis-cli', 'pg_isready'];
const optional: Record<string, string> = {
	rex: 'runs the stack in one session (bun stack)',
	maestro: 'runs the dashboard e2e flows (bun e2e:dashboard)',
	xcrun: 'iOS simulator for the mobile apps'
};

const missing = [];
for (const tool of required) {
	if (!(await has(tool))) missing.push(tool);
}

if (missing.length > 0) {
	console.error(
		`Missing: ${missing.join(', ')}. Install Redis and Postgres (Postgres.app or Homebrew) and try again.`
	);
	process.exit(1);
}

for (const [tool, why] of Object.entries(optional)) {
	if (!(await has(tool))) console.log(`  (optional) ${tool} not found: ${why}`);
}

step('Installing dependencies');
await $`bun install`.cwd(ROOT);
await $`bun install`.cwd(at('api'));

step('Creating env files');

const copyEnv = async (
	example: string,
	target: string,
	transform: (text: string) => string = t => t
) => {
	if (existsSync(at(target))) {
		console.log(`  ${target} exists, leaving it`);
		return;
	}

	await Bun.write(at(target), transform(await Bun.file(at(example)).text()));
	console.log(`  wrote ${target}`);
};

await copyEnv('api/.env.example', 'api/.env', text =>
	text.replace(
		/^JWT_SECRET=$/m,
		`JWT_SECRET=${randomBytes(32).toString('hex')}`
	)
);
await copyEnv('apps/web/.env.example', 'apps/web/.env.local');
await copyEnv('apps/admin/.env.example', 'apps/admin/.env.local');
await copyEnv('apps/dashboard/.env.example', 'apps/dashboard/.env.local');
await copyEnv('apps/app/.env.example', 'apps/app/.env.local');

// The committed .env.e2e has no Postgres credentials. If your dev URL
// has some, reuse them for the e2e database.
if (!existsSync(at('.env.e2e.local'))) {
	const devEnv = await Bun.file(at('api/.env')).text();
	const devUrl = devEnv.match(/^DATABASE_URL=["']?([^"'\n]+)/m)?.[1];

	if (devUrl && new URL(devUrl).username) {
		const e2eUrl = new URL(devUrl);
		e2eUrl.pathname = '/habiti_e2e';
		await Bun.write(at('.env.e2e.local'), `DATABASE_URL="${e2eUrl}"\n`);
		console.log(
			'  wrote .env.e2e.local (your Postgres credentials, habiti_e2e)'
		);
	}
}

step('Starting Redis and Postgres');

if ((await $`redis-cli ping`.nothrow().quiet()).exitCode !== 0) {
	await $`redis-server --daemonize yes`.quiet();
}

if ((await $`pg_isready -h localhost -q`.nothrow().quiet()).exitCode !== 0) {
	if ((await $`open -Ra Postgres`.nothrow().quiet()).exitCode === 0) {
		await $`open -ga Postgres`.quiet();
		for (let i = 0; i < 20; i++) {
			if (
				(await $`pg_isready -h localhost -q`.nothrow().quiet()).exitCode === 0
			)
				break;
			await Bun.sleep(500);
		}
	}
}

if ((await $`pg_isready -h localhost -q`.nothrow().quiet()).exitCode !== 0) {
	console.error(
		'Postgres is not running on localhost:5432. Start it and run `bun setup` again.'
	);
	process.exit(1);
}

step('Preparing databases');
await $`bunx --bun prisma generate`.cwd(at('api')).quiet();
await $`bun run db:prepare`.cwd(at('api'));
await $`bun run db:reset:e2e`.cwd(at('api'));

step('Installing the Playwright browser');
await $`bunx playwright install chromium`.cwd(at('apps/web'));

console.log(`
Done. Next:

  bun stack              dev stack in a Rex session (API on :4000, web :3000, admin :3001)
  bun stack --e2e        e2e stack (ports in .env.e2e), what the suites run against
  bun e2e:web            Playwright suite for the consumer web app
  bun e2e:dashboard      Maestro flows for the dashboard (needs a simulator build, see CLAUDE.md)

Seeded accounts (in the e2e database, and in dev if it started empty):
merchant@e2e.habiti.test, shopper@e2e.habiti.test, and
admin@e2e.habiti.test (password "password"). Read sign-in codes from the
API's logs:

  bun stack logs api | grep devOtp          (add --e2e for the e2e stack)
`);
