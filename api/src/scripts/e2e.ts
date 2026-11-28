import '../config/json';

import { env } from '../config/env';
import prisma from '../config/prisma';
import redis from '../config/redis';
import { getEmailCacheKey } from '../core/logic/auth';
import { scenarios, type ScenarioName } from '../test/factories';

const [command, name] = process.argv.slice(2);

const run = async () => {
	if (command === 'scenario') {
		if (!name || !(name in scenarios)) {
			throw new Error(
				`Unknown scenario. One of: ${Object.keys(scenarios).join(', ')}`
			);
		}

		return scenarios[name as ScenarioName](prisma);
	}

	if (command === 'outbox') {
		if (!env.PUSH_OUTBOX_KEY) throw new Error('PUSH_OUTBOX_KEY is not set');

		await redis.connect();
		const items = await redis.send('LRANGE', [env.PUSH_OUTBOX_KEY, '0', '-1']);

		return (items as string[]).map(item => JSON.parse(item)).reverse();
	}

	if (command === 'otp') {
		if (!name) throw new Error('Usage: e2e otp EMAIL');

		// The code is cached when the app asks for it, which can be a moment
		// after the runner sees the verify screen.
		await redis.connect();
		for (let i = 0; i < 50; i++) {
			const code = await redis.get(getEmailCacheKey(name));
			if (code) return code;
			await Bun.sleep(200);
		}

		throw new Error(`No verification code for ${name}`);
	}

	throw new Error('Usage: e2e <scenario NAME | outbox | otp EMAIL>');
};

try {
	// Logs can land around the result, so runners look for its prefix.
	console.log(`E2E_RESULT ${JSON.stringify(await run())}`);
	process.exit(0);
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
