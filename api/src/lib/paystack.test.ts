import { describe, expect, spyOn, test } from 'bun:test';
import * as Sentry from '@sentry/bun';

import { rootLogger } from '../services/logger';
import { REDACTED } from '../utils/redact';
import { reportPaystackFailure } from './paystack';

describe('reportPaystackFailure', () => {
	test('logs and captures one already-redacted record', () => {
		const logged: unknown[] = [];
		const captured: unknown[] = [];

		const errorSpy = spyOn(rootLogger, 'error').mockImplementation(
			(entry: unknown) => {
				logged.push(entry);
				return undefined as never;
			}
		);
		const captureSpy = spyOn(Sentry, 'captureException').mockImplementation(
			(_error: unknown, hint?: unknown) => {
				captured.push(hint);
				return 'event';
			}
		);

		const payload = {
			authorization_code: 'AUTH_secret',
			email: 'ada@example.com',
			amount: '5000',
			metadata: { orderId: 'order-1' }
		};
		const responseData = {
			status: false,
			message: 'Email is invalid',
			code: 'invalid_params',
			data: {
				authorization: { authorization_code: 'AUTH_from_body' },
				customer: { email: 'ada@example.com', first_name: 'Ada' },
				details: {
					account_number: '0123456789',
					account_name: 'Ada Obi',
					bank_code: '058'
				}
			}
		};
		const error = {
			code: 'ERR_BAD_REQUEST',
			message: 'Request failed with status code 400',
			response: {
				status: 400,
				statusText: 'Bad Request',
				data: responseData
			}
		};

		try {
			const logEntry = reportPaystackFailure(
				'chargeAuthorization',
				payload,
				error
			);

			expect(errorSpy).toHaveBeenCalledTimes(1);
			expect(captureSpy).toHaveBeenCalledTimes(1);
			expect(logged[0]).toBe(logEntry);
			expect(captured[0]).toEqual({
				tags: { integration: 'paystack', operation: 'chargeAuthorization' },
				extra: logEntry
			});
			expect((captured[0] as { extra: unknown }).extra).toBe(logEntry);

			const serialized = JSON.stringify(logEntry);
			expect(serialized).not.toContain('AUTH_secret');
			expect(serialized).not.toContain('AUTH_from_body');
			expect(serialized).not.toContain('0123456789');
			expect(serialized).not.toContain('ada@example.com');
			expect(serialized).not.toContain('Ada Obi');
			expect(serialized).not.toContain('"Ada"');

			const entry = logEntry as {
				operation: string;
				status: number;
				statusText: string;
				code: string;
				message: string;
				paystackCode: string;
				request: {
					email: string;
					amount: string;
					authorization_code: string;
					metadata: { orderId: string };
				};
				responseData: {
					code: string;
					message: string;
					data: {
						details: { bank_code: string; account_number: string };
						customer: { email: string };
					};
				};
			};

			expect(entry.operation).toBe('chargeAuthorization');
			expect(entry.status).toBe(400);
			expect(entry.statusText).toBe('Bad Request');
			expect(entry.code).toBe('ERR_BAD_REQUEST');
			expect(entry.message).toBe('Request failed with status code 400');
			expect(entry.paystackCode).toBe('invalid_params');
			expect(entry.request.email).toBe('a***@example.com');
			expect(entry.request.amount).toBe('5000');
			expect(entry.request.metadata.orderId).toBe('order-1');
			expect(entry.request.authorization_code).toBe(REDACTED);
			expect(entry.responseData.code).toBe('invalid_params');
			expect(entry.responseData.message).toBe('Email is invalid');
			expect(entry.responseData.data.details.bank_code).toBe('058');
			expect(entry.responseData.data.details.account_number).toBe(REDACTED);
			expect(entry.responseData.data.customer.email).toBe('a***@example.com');

			expect(payload.authorization_code).toBe('AUTH_secret');
			expect(payload.email).toBe('ada@example.com');
			expect(responseData.data.details.account_number).toBe('0123456789');
			expect(responseData.data.authorization.authorization_code).toBe(
				'AUTH_from_body'
			);
		} finally {
			errorSpy.mockRestore();
			captureSpy.mockRestore();
		}
	});
});
