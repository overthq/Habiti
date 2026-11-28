import { createHmac, randomUUID } from 'crypto';
import { Hono } from 'hono';

// Magic values:
// - Saved-card codes containing `decline` are declined.
// - Account number 0000000000 fails to resolve.
// - Payouts to an account number starting with 999 fail. The recipient code
//   carries that (`RCP_fail_…`), so seeded recipients behave the same way.

const PORT = Number(Bun.env.FAKE_PAYSTACK_PORT ?? 4010);
const ORIGIN = `http://localhost:${PORT}`;
const SECRET = Bun.env.PAYSTACK_SECRET_KEY ?? 'sk_test_fake';
const WEBHOOK_URL =
	Bun.env.PAYSTACK_WEBHOOK_URL ?? 'http://localhost:4000/webhooks/paystack';
const TRANSFER_DELAY_MS = Number(
	Bun.env.FAKE_PAYSTACK_TRANSFER_DELAY_MS ?? 500
);

type Authorization = {
	authorization_code: string;
	bin: string;
	last4: string;
	exp_month: string;
	exp_year: string;
	channel: string;
	card_type: string;
	bank: string;
	country_code: string;
	brand: string;
	reusable: boolean;
	signature: string;
	account_name: null;
};

type Charge = {
	id: number;
	reference: string;
	accessCode: string;
	email: string;
	amount: number;
	metadata: unknown;
	status: 'pending' | 'success' | 'failed' | 'abandoned';
	authorization?: Authorization;
};

type Transfer = {
	id: number;
	reference: string;
	transferCode: string;
	amount: number;
	reason: string;
	status: 'pending' | 'success' | 'failed';
};

const charges = new Map<string, Charge>();
const chargesByAccessCode = new Map<string, Charge>();
const authorizations = new Map<string, Authorization>();
const transfers = new Map<string, Transfer>();

// Paystack ids are unique across restarts, and the API dedupes webhooks on them.
let nextId = Date.now();

const ok = <T>(data: T, message = 'ok') => ({ status: true, message, data });

const sendWebhook = async (event: string, data: unknown) => {
	const body = JSON.stringify({ event, data });
	const signature = createHmac('sha512', SECRET).update(body).digest('hex');

	try {
		const res = await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-paystack-signature': signature
			},
			body
		});
		console.log(`webhook ${event} -> ${res.status}`);
	} catch (error) {
		console.error(`webhook ${event} failed`, error);
	}
};

const chargeData = (charge: Charge) => ({
	id: charge.id,
	status: charge.status,
	reference: charge.reference,
	amount: charge.amount,
	channel: 'card',
	currency: 'NGN',
	gateway_response: charge.status === 'success' ? 'Approved' : 'Declined',
	metadata: charge.metadata ?? null,
	customer: { email: charge.email },
	authorization: charge.authorization ?? null
});

const createCharge = (input: {
	email: string;
	amount: number;
	metadata: unknown;
}) => {
	const charge: Charge = {
		id: nextId++,
		reference: `ref_${randomUUID()}`,
		accessCode: `ac_${randomUUID()}`,
		status: 'pending',
		...input
	};

	charges.set(charge.reference, charge);
	chargesByAccessCode.set(charge.accessCode, charge);

	return charge;
};

const cardAuthorization = (email: string): Authorization => ({
	authorization_code: `AUTH_${randomUUID()}`,
	bin: '408408',
	last4: '4081',
	exp_month: '12',
	exp_year: '2030',
	channel: 'card',
	card_type: 'visa',
	bank: 'Test Bank',
	country_code: 'NG',
	brand: 'visa',
	reusable: true,
	// Paystack keeps one signature per card, so one per shopper here.
	signature: `SIG_${createHmac('sha256', 'fake').update(email).digest('hex').slice(0, 16)}`,
	account_name: null
});

const settleCharge = async (charge: Charge, succeeded: boolean) => {
	if (charge.status !== 'pending') return;

	if (!succeeded) {
		charge.status = 'failed';
		return;
	}

	charge.authorization ??= cardAuthorization(charge.email);

	authorizations.set(
		charge.authorization.authorization_code,
		charge.authorization
	);
	charge.status = 'success';

	await sendWebhook('charge.success', chargeData(charge));
};

const app = new Hono();

app.use('*', async (c, next) => {
	await next();
	console.log(`${c.req.method} ${c.req.path} -> ${c.res.status}`);
});

app.post('/transaction/initialize', async c => {
	const body = await c.req.json();
	const charge = createCharge({
		email: body.email,
		amount: Number(body.amount),
		metadata: body.metadata
	});

	return c.json(
		ok({
			authorization_url: `${ORIGIN}/checkout/${charge.accessCode}`,
			access_code: charge.accessCode,
			reference: charge.reference
		})
	);
});

app.post('/transaction/charge_authorization', async c => {
	const body = await c.req.json();
	const code: string = body.authorization_code ?? '';
	// Seeded cards were never charged here, so accept any well-formed code.
	const authorization =
		authorizations.get(code) ??
		(code.startsWith('AUTH_') && !code.includes('decline')
			? { ...cardAuthorization(body.email), authorization_code: code }
			: undefined);

	const charge = createCharge({
		email: body.email,
		amount: Number(body.amount),
		metadata: body.metadata
	});

	if (!authorization) {
		charge.status = 'failed';
		return c.json(ok(chargeData(charge), 'Charge attempted'));
	}

	charge.authorization = authorization;
	// Paystack answers before the webhook arrives, so settle after replying.
	setTimeout(() => void settleCharge(charge, true), 100);

	return c.json(ok({ ...chargeData(charge), status: 'success' }));
});

app.get('/transaction/verify/:reference', c => {
	const charge = charges.get(c.req.param('reference'));

	if (!charge) {
		return c.json(
			{ status: false, message: 'Transaction reference not found' },
			404
		);
	}

	return c.json(ok(chargeData(charge), 'Verification successful'));
});

const BANKS: Record<string, string> = {
	'044': 'Access Bank',
	'058': 'Guaranty Trust Bank',
	'057': 'Zenith Bank'
};

app.get('/bank', c =>
	c.json(ok(Object.entries(BANKS).map(([code, name]) => ({ name, code }))))
);

app.get('/bank/resolve', c => {
	const accountNumber = c.req.query('account_number') ?? '';

	if (!/^\d{10}$/.test(accountNumber) || accountNumber === '0000000000') {
		return c.json(
			{ status: false, message: 'Could not resolve account name' },
			422
		);
	}

	return c.json(
		ok({
			account_number: accountNumber,
			account_name: 'E2E TEST ACCOUNT',
			bank_id: 9
		})
	);
});

app.post('/transferrecipient', async c => {
	const body = await c.req.json();
	const fails = String(body.account_number).startsWith('999');
	const recipientCode = `RCP_${fails ? 'fail_' : ''}${randomUUID()}`;

	return c.json(
		ok({
			active: true,
			createdAt: new Date().toISOString(),
			currency: 'NGN',
			description: null,
			domain: 'test',
			email: null,
			id: nextId++,
			integration: 1,
			metadata: null,
			recipient_code: recipientCode,
			details: {
				authorization_code: null,
				account_number: body.account_number,
				account_name: 'E2E TEST ACCOUNT',
				bank_code: body.bank_code,
				bank_name: BANKS[body.bank_code] ?? 'Test Bank'
			}
		})
	);
});

app.post('/transfer', async c => {
	const body = await c.req.json();
	const transfer: Transfer = {
		id: nextId++,
		reference: body.reference,
		transferCode: `TRF_${randomUUID()}`,
		amount: Number(body.amount),
		reason: body.reason,
		status: 'pending'
	};

	transfers.set(transfer.reference, transfer);

	const fails = String(body.recipient).startsWith('RCP_fail_');

	setTimeout(() => {
		transfer.status = fails ? 'failed' : 'success';
		void sendWebhook(fails ? 'transfer.failure' : 'transfer.success', {
			id: transfer.id,
			reference: transfer.reference,
			reason: transfer.reason,
			amount: transfer.amount,
			transfer_code: transfer.transferCode,
			status: transfer.status
		});
	}, TRANSFER_DELAY_MS);

	return c.json(
		ok(
			{
				reference: transfer.reference,
				transfer_code: transfer.transferCode,
				status: transfer.status,
				amount: transfer.amount
			},
			'Transfer has been queued'
		)
	);
});

app.get('/transfer/verify/:reference', c => {
	const transfer = transfers.get(c.req.param('reference'));

	if (!transfer) {
		return c.json({ status: false, message: 'Transfer not found' }, 404);
	}

	return c.json(
		ok({
			status: transfer.status,
			reason: transfer.reason,
			transfer_code: transfer.transferCode
		})
	);
});

app.post('/transfer/finalize_transfer', async c => {
	const body = await c.req.json();
	const transfer = [...transfers.values()].find(
		t => t.transferCode === body.transfer_code
	);

	return c.json(
		ok({
			status: transfer?.status ?? 'failed',
			reason: transfer?.reason ?? '',
			transfer_code: body.transfer_code
		})
	);
});

const formatNaira = (kobo: number) =>
	`₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

const page = (title: string, body: string) =>
	`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 360px; margin: 64px auto; padding: 0 16px; }
button { display: block; width: 100%; padding: 12px; margin-top: 12px; font-size: 16px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; }
button[value="pay"] { background: #111; color: #fff; border-color: #111; }
</style>
</head>
<body>${body}</body>
</html>`;

app.get('/checkout/:accessCode', c => {
	const charge = chargesByAccessCode.get(c.req.param('accessCode'));

	if (!charge) {
		return c.html(page('Not found', '<h1>Unknown checkout</h1>'), 404);
	}

	if (charge.status !== 'pending') {
		return c.html(page('Checkout', `<h1>Payment ${charge.status}</h1>`));
	}

	return c.html(
		page(
			'Fake Paystack checkout',
			`<h1>Fake Paystack</h1>
<p>${charge.email} is paying <strong>${formatNaira(charge.amount)}</strong>.</p>
<form method="post">
<button name="outcome" value="pay">Pay</button>
<button name="outcome" value="decline">Decline</button>
</form>`
		)
	);
});

app.post('/checkout/:accessCode', async c => {
	const charge = chargesByAccessCode.get(c.req.param('accessCode'));

	if (!charge) {
		return c.html(page('Not found', '<h1>Unknown checkout</h1>'), 404);
	}

	const form = await c.req.parseBody();
	await settleCharge(charge, form.outcome === 'pay');

	return c.html(
		page(
			'Checkout',
			`<h1>Payment ${charge.status}</h1>
<p>You can close this window.</p>
<script>setTimeout(() => window.close(), 300)</script>`
		)
	);
});

app.get('/health', c => c.json({ status: 'ok' }));

Bun.serve({ port: PORT, fetch: app.fetch });

console.log(`fake paystack listening on ${ORIGIN}, webhooks -> ${WEBHOOK_URL}`);
