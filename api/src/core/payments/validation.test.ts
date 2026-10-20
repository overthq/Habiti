import { describe, expect, test } from 'bun:test';

import { ChargeEventSchema } from './validation';

describe('ChargeEventSchema', () => {
	test('reads orderId from object or JSON string metadata', () => {
		const orderIdOf = (metadata: unknown) =>
			ChargeEventSchema.parse({ metadata }).orderId;

		expect(orderIdOf({ orderId: 'order-1' })).toBe('order-1');
		expect(orderIdOf('{"orderId":"order-1"}')).toBe('order-1');
		expect(orderIdOf('')).toBeUndefined();
		expect(orderIdOf(0)).toBeUndefined();
	});

	test('only returns a card for card charges', () => {
		const authorization = {
			authorization_code: 'AUTH_card',
			signature: 'SIG_card',
			bin: '408408',
			last4: '4081',
			exp_month: '12',
			exp_year: '2030',
			card_type: 'visa',
			bank: 'Test Bank',
			country_code: 'NG'
		};
		const customer = { email: 'ada@example.com' };

		expect(
			ChargeEventSchema.parse({ customer, authorization }).card
		).toMatchObject({
			authorizationCode: 'AUTH_card',
			email: 'ada@example.com'
		});
		expect(
			ChargeEventSchema.parse({
				customer,
				authorization: { ...authorization, card_type: 'transfer' }
			}).card
		).toBeUndefined();
	});
});
