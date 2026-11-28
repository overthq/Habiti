import { defineConfig, devices } from '@playwright/test';

import { urls } from '../../e2e/ports';

const CI = Boolean(process.env.CI);
const ARTIFACTS = '../../.e2e-artifacts/web';

export default defineConfig({
	testDir: './e2e',
	// Cross-app journeys need the dashboard steps; e2e/order-journey.ts runs them.
	testIgnore: process.env.JOURNEY ? [] : ['**/journeys/**'],
	outputDir: `${ARTIFACTS}/results`,
	fullyParallel: true,
	forbidOnly: CI,
	retries: CI ? 1 : 0,
	workers: CI ? 2 : 4,
	timeout: 60_000,
	expect: { timeout: 10_000 },
	reporter: [
		['list'],
		['html', { outputFolder: `${ARTIFACTS}/report`, open: 'never' }]
	],
	globalSetup: './e2e/global-setup.ts',
	use: {
		baseURL: urls.web,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{
			name: 'mobile',
			use: { ...devices['Pixel 7'] },
			grep: /@mobile/
		}
	],
	webServer: [
		{
			command: 'bun run --cwd ../../api dev:e2e',
			url: `${urls.api}/health/live`,
			reuseExistingServer: !CI,
			timeout: 60_000
		},
		{
			command: 'bun run --cwd ../../api fake-paystack:e2e',
			url: `${urls.paystack}/health`,
			reuseExistingServer: !CI
		},
		{
			command: 'bun run dev:e2e',
			url: urls.web,
			reuseExistingServer: !CI,
			timeout: 120_000
		}
	]
});
