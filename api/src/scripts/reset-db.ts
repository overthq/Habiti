import { $ } from 'bun';
import { Client } from 'pg';

const allowDev = process.argv.includes('--allow-dev');
const keepData = process.argv.includes('--keep-data');
const skipSeed = process.argv.includes('--no-seed');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error('DATABASE_URL is not set');

const url = new URL(databaseUrl);
const database = url.pathname.slice(1);

if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
	throw new Error(`Refusing to reset a database on ${url.hostname}`);
}

if (!database.endsWith('_e2e') && !allowDev && !keepData) {
	throw new Error(
		`Refusing to reset "${database}". Pass --allow-dev to reset a database ` +
			'whose name does not end in _e2e.'
	);
}

const admin = new URL(databaseUrl);
admin.pathname = '/postgres';
admin.search = '';

const adminClient = new Client({ connectionString: admin.toString() });
await adminClient.connect();

const { rowCount } = await adminClient.query(
	'SELECT 1 FROM pg_database WHERE datname = $1',
	[database]
);

if (!rowCount) {
	await adminClient.query(`CREATE DATABASE "${database.replace(/"/g, '""')}"`);
	console.log(`Created database ${database}`);
}

await adminClient.end();

const migrate = await $`bunx --bun prisma migrate deploy`
	.env({ ...process.env })
	.nothrow()
	.quiet();

if (migrate.exitCode !== 0) {
	const output = `${migrate.stdout}${migrate.stderr}`;

	// A database built with `prisma db push` has no migration history.
	if (!keepData) throw new Error(`prisma migrate deploy failed:\n${output}`);
	console.warn(`Skipped migrations for ${database}:\n${output.trim()}`);
}

const client = new Client({ connectionString: databaseUrl });
await client.connect();

if (keepData) {
	const users = await client
		.query('SELECT 1 FROM "User" LIMIT 1')
		.catch(() => null);
	await client.end();

	if (users?.rowCount) {
		console.log(`${database} already has data, leaving it alone`);
		process.exit(0);
	}

	const { seed, SEED_ACCOUNTS } = await import('./seed');
	const { default: prisma } = await import('../config/prisma');

	await seed();
	await prisma.$disconnect();
	console.log(`Seeded ${database}. Accounts:`, SEED_ACCOUNTS);
	process.exit(0);
}

const schema = url.searchParams.get('schema') ?? 'public';
const { rows } = await client.query<{ tablename: string }>(
	`SELECT tablename FROM pg_tables WHERE schemaname = $1 AND tablename <> '_prisma_migrations'`,
	[schema]
);

if (rows.length > 0) {
	const tables = rows.map(r => `"${schema}"."${r.tablename}"`).join(', ');
	await client.query(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
}

await client.end();

if (process.env.REDIS_URL) {
	const redis = new Bun.RedisClient(process.env.REDIS_URL);
	await redis.send('FLUSHDB', []);
	redis.close();
}

console.log(`Reset ${database} (${rows.length} tables)`);

if (!skipSeed) {
	const { seed, SEED_ACCOUNTS } = await import('./seed');
	const { default: prisma } = await import('../config/prisma');

	await seed();
	await prisma.$disconnect();
	console.log('Seeded. Accounts:', SEED_ACCOUNTS);
}

process.exit(0);
