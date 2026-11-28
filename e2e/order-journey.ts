import { $ } from 'bun';
import path from 'path';

import {
	maestroVars,
	serveVerificationCodes
} from '../apps/dashboard/e2e/maestro';

const ROOT = path.resolve(import.meta.dir, '..');
const API = path.join(ROOT, 'api');
const DASHBOARD = path.join(ROOT, 'apps/dashboard/e2e/journeys');
const WEB = path.join(ROOT, 'apps/web');
const ARTIFACTS = path.join(ROOT, '.e2e-artifacts/journey');

const scenario = async (name: string) => {
	const output = await $`bun run --silent e2e scenario ${name}`.cwd(API).text();
	const line = output.split('\n').find(l => l.startsWith('E2E_RESULT '));
	if (!line) throw new Error(`Scenario ${name} printed no result:\n${output}`);
	return JSON.parse(line.slice('E2E_RESULT '.length));
};

const { merchant, store } = await scenario('merchant');
const { shopper } = await scenario('shopperWithCart');
const productName = `Journey Kaftan ${Date.now()}`;

const maestroEnv = Object.entries(maestroVars).flatMap(([k, v]) => [
	'-e',
	`${k}=${v}`
]);

const maestro = (flow: string) =>
	$`maestro test ${maestroEnv} -e EMAIL=${merchant.email} -e STORE_NAME=${store.name} -e PRODUCT_NAME=${productName} -e SHOPPER_NAME=${shopper.name} --test-output-dir ${path.join(ARTIFACTS, flow)} ${flow}.yaml`.cwd(
		DASHBOARD
	);

const web = (step: string) =>
	$`bunx playwright test e2e/journeys --project desktop`.cwd(WEB).env({
		...process.env,
		JOURNEY: '1',
		JOURNEY_STEP: step,
		JOURNEY_SHOPPER_EMAIL: shopper.email,
		JOURNEY_STORE_ID: store.id,
		JOURNEY_STORE_NAME: store.name,
		JOURNEY_PRODUCT_NAME: productName
	});

const codes = serveVerificationCodes();

console.log('▸ 1. Merchant lists a product (dashboard)');
await maestro('add-product');
console.log('▸ 2. Shopper buys it (web)');
await web('buy');
console.log('▸ 3. Merchant gets it ready (dashboard)');
await maestro('fulfil-order');
console.log('▸ 4. Shopper collects it (web)');
await web('collect');

codes.stop();
console.log('\nOrder journey passed.');
