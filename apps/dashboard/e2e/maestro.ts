import { $ } from 'bun';
import path from 'path';

import { ports, urls } from '../../../e2e/ports';

const API_DIR = path.resolve(import.meta.dir, '../../../api');

// Variables every flow gets. The `__expo_disable_*` params turn off the dev
// client's onboarding, its floating tools button (which sits over header
// buttons) and the developer menu it opens at launch.
export const maestroVars = {
	DEV_CLIENT_LINK: `exp+habiti-dashboard://expo-development-client/?__expo_url=${encodeURIComponent(urls.metro)}&__expo_disable_onboarding=1&__expo_disable_fab=1&__expo_disable_auto_launch=1`,
	CODES_URL: urls.codes
};

// Maestro flows cannot run commands, so `subflows/verification-code.js`
// fetches sign-in codes from here while the runner is up.
export const serveVerificationCodes = () =>
	Bun.serve({
		port: ports.codes,
		hostname: '127.0.0.1',
		fetch: async req => {
			const email = new URL(req.url).searchParams.get('email');
			if (!email) return new Response('email is required', { status: 400 });

			const output = await $`bun run --silent e2e otp ${email}`
				.cwd(API_DIR)
				.nothrow()
				.text();
			const line = output.split('\n').find(l => l.startsWith('E2E_RESULT '));

			return line
				? new Response(JSON.parse(line.slice('E2E_RESULT '.length)))
				: new Response(output, { status: 404 });
		}
	});
