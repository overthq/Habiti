import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

async function main() {
	console.log('Running migrations...');

	await migrate(db, {
		migrationsFolder: './drizzle'
	});

	console.log('Migrations complete!');

	await pool.end();
}

main().catch(err => {
	console.error('Migration failed!');
	console.error(err);
	process.exit(1);
});
