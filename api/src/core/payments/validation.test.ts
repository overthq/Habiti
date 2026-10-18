import { describe, expect, test } from 'bun:test';

import { ChargeEventSchema } from './validation';

const transferAuthorization = {
	card_type: 'transfer',
	channel: 'bank_transfer'
};

describe('ChargeEventSchema', () => {
	test('reads orderId from an object or a JSON string', () => {
		expect(
			ChargeEventSchema.parse({ metadata: { orderId: 'order-1' } }).orderId
		).toBe('order-1');
		expect(
			ChargeEventSchema.parse({
				metadata: JSON.stringify({ orderId: 'order-1' })
			}).orderId
		).toBe('order-1');
		expect(
			ChargeEventSchema.parse({
				metadata: JSON.stringify(JSON.stringify({ orderId: ' order-1 ' }))
			}).orderId
		).toBe('order-1');
	});

	test('ignores empty, invalid, and non-object metadata', () => {
		for (const metadata of ['', 'not-json', 0, null, [], { orderId: '' }]) {
			expect(ChargeEventSchema.parse({ metadata }).orderId).toBeNull();
		}
	});

	test('accepts integer subunit amounts only', () => {
		expect(ChargeEventSchema.parse({ amount: 162_250 }).amount).toBe(162_250);
		expect(ChargeEventSchema.parse({ amount: '162250' }).amount).toBe(162_250);
		expect(ChargeEventSchema.parse({ amount: 162_250.5 }).amount).toBeNull();
		expect(ChargeEventSchema.parse({ amount: -1 }).amount).toBeNull();
	});

	test('classifies checkout transfer separately from a dedicated account', () => {
		expect(
			ChargeEventSchema.parse({
				channel: 'bank_transfer',
				authorization: transferAuthorization
			}).instrument
		).toBe('transfer');

		expect(
			ChargeEventSchema.parse({
				channel: 'dedicated_nuban',
				authorization: { card_type: 'transfer', channel: 'dedicated_nuban' }
			})
		).toMatchObject({ instrument: 'dedicated_account', card: null });
	});

	test('maps a card authorization into stored-card fields', () => {
		const charge = ChargeEventSchema.parse({
			channel: 'card',
			customer: { email: 'ada@example.com' },
			authorization: {
				authorization_code: 'AUTH_card',
				card_type: 'visa',
				last4: '4081',
				exp_month: '12',
				exp_year: '2030',
				bin: '408408',
				bank: 'Test Bank',
				channel: 'card',
				signature: 'SIG_card',
				country_code: 'NG'
			}
		});

		expect(charge.instrument).toBe('card');
		expect(charge.card).toEqual({
			email: 'ada@example.com',
			signature: 'SIG_card',
			authorizationCode: 'AUTH_card',
			bin: '408408',
			last4: '4081',
			expMonth: '12',
			expYear: '2030',
			bank: 'Test Bank',
			cardType: 'visa',
			countryCode: 'NG'
		});
	});

	test('reads a rejection reason from the first present field', () => {
		expect(
			ChargeEventSchema.parse({
				amount: 100,
				reference: 'ref_rejected',
				gateway_response: 'Incorrect amount',
				channel: 'bank_transfer',
				metadata: JSON.stringify({ orderId: 'order-1' }),
				authorization: transferAuthorization
			})
		).toMatchObject({
			orderId: 'order-1',
			amount: 100,
			reference: 'ref_rejected',
			reason: 'Incorrect amount',
			instrument: 'transfer',
			card: null
		});
	});
});
