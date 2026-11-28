import { readFileSync } from 'node:fs';
import path from 'node:path';

// Parsed rather than loaded into process.env: processes started from a runner
// inherit its env, and an inherited DATABASE_URL would beat the one in
// .env.e2e.local.
const lines = readFileSync(
	path.resolve(import.meta.dirname, '../.env.e2e'),
	'utf8'
).split('\n');

const port = (name: string) => {
	const value = lines
		.map(line => line.match(/^(\w+)=(\d+)$/))
		.find(match => match?.[1] === name)?.[2];

	if (!value) throw new Error(`${name} is missing from .env.e2e`);

	return Number(value);
};

export const ports = {
	api: port('E2E_API_PORT'),
	paystack: port('E2E_PAYSTACK_PORT'),
	web: port('E2E_WEB_PORT'),
	admin: port('E2E_ADMIN_PORT'),
	metro: port('E2E_METRO_PORT'),
	codes: port('E2E_CODES_PORT')
};

export const urls = {
	api: `http://localhost:${ports.api}`,
	paystack: `http://localhost:${ports.paystack}`,
	web: `http://localhost:${ports.web}`,
	admin: `http://localhost:${ports.admin}`,
	metro: `http://localhost:${ports.metro}`,
	codes: `http://127.0.0.1:${ports.codes}`
};
