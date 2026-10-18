import { describe, expect, test } from 'bun:test';

import { maskEmail, paystackErrorCode, REDACTED, redactSensitive } from './redact';

describe('redactSensitive', () => {
	test('redacts a nested snake_case account number inside responseData', () => {
		const input = {
			operation: 'createTransferRecipient',
			responseData: {
				status: false,
				message: 'Account number is invalid',
				code: 'invalid_params',
				data: {
					details: {
						account_number: '0123456789',
						account_name: 'Ada Obi',
						bank_code: '058',
						bank_name: 'Guaranty Trust Bank',
						authorization_code: 'AUTH_nested'
					}
				}
			}
		};

		const redacted = redactSensitive(input);

		expect(redacted.responseData.data.details.account_number).toBe(REDACTED);
		expect(redacted.responseData.data.details.account_name).toBe(REDACTED);
		expect(redacted.responseData.data.details.authorization_code).toBe(
			REDACTED
		);
		expect(redacted.responseData.data.details.bank_code).toBe('058');
		expect(redacted.responseData.data.details.bank_name).toBe(
			'Guaranty Trust Bank'
		);
		expect(redacted.responseData.code).toBe('invalid_params');
		expect(redacted.responseData.message).toBe('Account number is invalid');
		expect(redacted.operation).toBe('createTransferRecipient');
		expect(JSON.stringify(redacted)).not.toContain('0123456789');
		expect(JSON.stringify(redacted)).not.toContain('AUTH_nested');
		expect(JSON.stringify(redacted)).not.toContain('Ada Obi');
	});

	test('redacts camelCase credentials and account numbers', () => {
		const redacted = redactSensitive({
			authorizationCode: 'AUTH_camel',
			accountNumber: '9988776655',
			accessCode: 'access-secret',
			bankCode: '058',
			otp: '123456'
		});

		expect(redacted.authorizationCode).toBe(REDACTED);
		expect(redacted.accountNumber).toBe(REDACTED);
		expect(redacted.accessCode).toBe(REDACTED);
		expect(redacted.otp).toBe(REDACTED);
		expect(redacted.bankCode).toBe('058');
	});

	test('redacts secrets inside arrays, including transfer account numbers', () => {
		const redacted = redactSensitive({
			responseData: {
				data: [
					{ account_number: '1111111111', bank_code: '011' },
					{
						authorization: {
							sender_bank_account_number: '2222222222',
							receiver_bank_account_number: '3333333333',
							sender_name: 'Ada Obi'
						}
					}
				]
			}
		});

		const first = redacted.responseData.data[0];
		const second = redacted.responseData.data[1];

		expect(first?.account_number).toBe(REDACTED);
		expect(first?.bank_code).toBe('011');
		expect(second?.authorization?.sender_bank_account_number).toBe(REDACTED);
		expect(second?.authorization?.receiver_bank_account_number).toBe(REDACTED);
		expect(second?.authorization?.sender_name).toBe(REDACTED);
		expect(JSON.stringify(redacted)).not.toContain('1111111111');
		expect(JSON.stringify(redacted)).not.toContain('2222222222');
		expect(JSON.stringify(redacted)).not.toContain('3333333333');
	});

	test('masks nested emails and leaves a non-email as redacted', () => {
		const redacted = redactSensitive({
			request: { email: 'ada@example.com' },
			responseData: {
				data: { customer: { email: 'Chidi@Example.com', phone: '08031234567' } }
			},
			broken: { email: 'not-an-email' }
		});

		expect(redacted.request.email).toBe('a***@example.com');
		expect(redacted.responseData.data.customer.email).toBe('C***@Example.com');
		expect(redacted.responseData.data.customer.phone).toBe(REDACTED);
		expect(redacted.broken.email).toBe(REDACTED);
		expect(JSON.stringify(redacted)).not.toContain('ada@example.com');
		expect(JSON.stringify(redacted)).not.toContain('08031234567');
	});

	test('does not mutate the original payload or its nested response', () => {
		const details = {
			account_number: '0123456789',
			authorization_code: 'AUTH_secret'
		};
		const input = {
			request: { email: 'ada@example.com', amount: '5000' },
			responseData: { data: { details } }
		};

		const redacted = redactSensitive(input);
		redacted.responseData.data.details.account_number = 'changed';
		redacted.request.email = 'changed@example.com';

		expect(input.request.email).toBe('ada@example.com');
		expect(input.request.amount).toBe('5000');
		expect(details.account_number).toBe('0123456789');
		expect(details.authorization_code).toBe('AUTH_secret');
		expect(redacted).not.toBe(input);
		expect(redacted.responseData).not.toBe(input.responseData);
	});

	test('keeps operational error codes and payout identifiers', () => {
		const redacted = redactSensitive({
			storeId: 'store-1',
			transactionId: 'txn-1',
			amount: 50_000,
			recipient: 'RCP_test',
			recipient_code: 'RCP_test',
			transfer_code: 'TRF_test',
			code: 'ERR_BAD_REQUEST',
			message: 'Request failed with status code 400',
			status: 400,
			statusText: 'Bad Request',
			paystackResponse: {
				status: false,
				message: 'Recipient not found',
				code: 'invalid_params'
			},
			name: 'Ada Obi'
		});

		expect(redacted.storeId).toBe('store-1');
		expect(redacted.transactionId).toBe('txn-1');
		expect(redacted.amount).toBe(50_000);
		expect(redacted.recipient).toBe('RCP_test');
		expect(redacted.recipient_code).toBe('RCP_test');
		expect(redacted.transfer_code).toBe('TRF_test');
		expect(redacted.code).toBe('ERR_BAD_REQUEST');
		expect(redacted.message).toBe('Request failed with status code 400');
		expect(redacted.status).toBe(400);
		expect(redacted.paystackResponse.code).toBe('invalid_params');
		expect(redacted.paystackResponse.message).toBe('Recipient not found');
		expect(redacted.name).toBe(REDACTED);
	});

	test('redacts a payout failure context without dropping ids', () => {
		const response = {
			status: false,
			message: 'Recipient not found',
			code: 'invalid_params',
			data: {
				details: {
					account_number: '0123456789',
					account_name: 'Ada Obi'
				}
			}
		};

		const redacted = redactSensitive({
			storeId: 'store-1',
			transactionId: 'txn-1',
			amount: 2500,
			recipient: 'RCP_live',
			paystackStatus: 400,
			paystackResponse: response,
			errorCode: 'ERR_BAD_REQUEST',
			errorMessage: 'Request failed with status code 400'
		});

		expect(redacted.storeId).toBe('store-1');
		expect(redacted.transactionId).toBe('txn-1');
		expect(redacted.amount).toBe(2500);
		expect(redacted.recipient).toBe('RCP_live');
		expect(redacted.paystackStatus).toBe(400);
		expect(redacted.errorCode).toBe('ERR_BAD_REQUEST');
		expect(redacted.errorMessage).toBe('Request failed with status code 400');
		expect(redacted.paystackResponse.code).toBe('invalid_params');
		expect(redacted.paystackResponse.message).toBe('Recipient not found');
		expect(redacted.paystackResponse.data.details.account_number).toBe(REDACTED);
		expect(redacted.paystackResponse.data.details.account_name).toBe(REDACTED);
		expect(response.data.details.account_number).toBe('0123456789');
	});

	test('walks a repeated object twice and stops on a cycle', () => {
		const shared = { email: 'ada@example.com', account_number: '0123456789' };
		const cycled: Record<string, unknown> = { accountNumber: '9988776655' };
		cycled.self = cycled;

		const redacted = redactSensitive({ a: shared, b: shared, cycled });

		expect(redacted.a.email).toBe('a***@example.com');
		expect(redacted.b.email).toBe('a***@example.com');
		expect(redacted.a.account_number).toBe(REDACTED);
		expect(redacted.b.account_number).toBe(REDACTED);
		expect(redacted.cycled.accountNumber).toBe(REDACTED);
		expect(redacted.cycled.self).toBe('[Circular]');
		expect(shared.email).toBe('ada@example.com');
		expect(cycled.accountNumber).toBe('9988776655');
	});

	test('does not return a raw object past the depth limit', () => {
		let deep: Record<string, unknown> = {
			account_number: '0123456789',
			email: 'ada@example.com'
		};

		for (let i = 0; i < 10; i++) deep = { nested: deep };

		const redacted = redactSensitive(deep);

		expect(JSON.stringify(redacted)).not.toContain('0123456789');
		expect(JSON.stringify(redacted)).not.toContain('ada@example.com');
		expect(JSON.stringify(redacted)).toContain(REDACTED);
	});
});

describe('maskEmail', () => {
	test('masks the local part and keeps the domain', () => {
		expect(maskEmail('ada@example.com')).toBe('a***@example.com');
	});

	test('redacts values that are not email addresses', () => {
		expect(maskEmail('ada')).toBe(REDACTED);
		expect(maskEmail(null)).toBe(REDACTED);
		expect(maskEmail({ address: 'ada@example.com' })).toBe(REDACTED);
	});
});

describe('paystackErrorCode', () => {
	test('reads a string error code and ignores credentials nested elsewhere', () => {
		expect(
			paystackErrorCode({
				code: 'invalid_params',
				data: { authorization_code: 'AUTH_secret' }
			})
		).toBe('invalid_params');
		expect(paystackErrorCode({ code: 12 })).toBeUndefined();
		expect(paystackErrorCode('nope')).toBeUndefined();
		expect(paystackErrorCode(null)).toBeUndefined();
	});
});
