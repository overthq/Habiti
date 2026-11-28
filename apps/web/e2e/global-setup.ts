import { execFileSync } from 'node:child_process';

import { API_DIR } from './fixtures';

export default function globalSetup() {
	// A journey run carries state over from the dashboard steps before it.
	if (process.env.JOURNEY) return;

	execFileSync('bun', ['run', 'db:reset:e2e'], {
		cwd: API_DIR,
		stdio: 'inherit'
	});
}
