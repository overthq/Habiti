import { describe, expect, test } from 'bun:test';
import { Writable } from 'node:stream';
import axios, {
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';
import pino from 'pino';

import { errorForLog } from '../utils/redact';
import { REDACT_PATHS } from './logger';

const logLine = (
	fields: Record<string, unknown>,
	level: 'info' | 'error' = 'info'
) => {
	let line = '';
	const stream = new Writable({
		write(chunk, _encoding, callback) {
			line += chunk.toString();
			callback();
		}
	});
	const logger = pino(
		{ redact: { paths: REDACT_PATHS, censor: '[REDACTED]' } },
		stream
	);

	logger[level](fields, 'probe');

	return JSON.parse(line) as Record<string, any>;
};

describe('REDACT_PATHS', () => {
	test('redacts snake_case secrets down to the Paystack response shape', () => {
		const line = logLine({
			request: {
				authorization_code: 'AUTH_secret',
				account_number: '0123456789',
				otp: '123456'
			},
			responseData: {
				data: {
					details: { account_number: '9988776655', bank_code: '058' },
					authorization: { authorization_code: 'AUTH_nested' }
				}
			}
		});

		expect(line.request.authorization_code).toBe('[REDACTED]');
		expect(line.request.account_number).toBe('[REDACTED]');
		expect(line.request.otp).toBe('[REDACTED]');
		expect(line.responseData.data.details.account_number).toBe('[REDACTED]');
		expect(line.responseData.data.details.bank_code).toBe('058');
		expect(line.responseData.data.authorization.authorization_code).toBe(
			'[REDACTED]'
		);
		expect(JSON.stringify(line)).not.toContain('AUTH_secret');
		expect(JSON.stringify(line)).not.toContain('0123456789');
		expect(JSON.stringify(line)).not.toContain('9988776655');
		expect(JSON.stringify(line)).not.toContain('123456');
	});

	test('redacts camelCase account numbers one level down', () => {
		const line = logLine({
			request: { accountNumber: '0123456789', authorizationCode: 'AUTH_camel' }
		});

		expect(line.request.accountNumber).toBe('[REDACTED]');
		expect(line.request.authorizationCode).toBe('[REDACTED]');
	});

	test('keeps a top-level error code and censors a one-level code', () => {
		const line = logLine({
			code: 'ERR_BAD_REQUEST',
			responseData: { code: 'invalid_params', message: 'Email is invalid' }
		});

		expect(line.code).toBe('ERR_BAD_REQUEST');
		expect(line.responseData.code).toBe('[REDACTED]');
		expect(line.responseData.message).toBe('Email is invalid');
	});

	test('an order charge failure does not emit the Paystack secret', () => {
		const secret = 'sk_live_paystack_secret';
		const error = new axios.AxiosError(
			'Request failed with status code 400',
			'ERR_BAD_REQUEST',
			{
				headers: {
					Authorization: `Bearer ${secret}`,
					'Content-Type': 'application/json'
				},
				data: {
					authorization_code: 'AUTH_secret',
					email: 'ada@example.com',
					account_number: '0123456789'
				}
			} as InternalAxiosRequestConfig,
			{},
			{
				status: 400,
				statusText: 'Bad Request',
				headers: {},
				config: {},
				data: {
					message: 'Email is invalid',
					account_number: '0123456789',
					authorization: { authorization_code: 'AUTH_from_body' }
				}
			} as AxiosResponse
		);

		const line = logLine(
			{ ...errorForLog(error), orderId: 'order-1' },
			'error'
		);
		const serialized = JSON.stringify(line);

		expect(serialized).not.toContain(secret);
		expect(serialized).not.toContain('Bearer');
		expect(serialized).not.toContain('AUTH_secret');
		expect(serialized).not.toContain('AUTH_from_body');
		expect(serialized).not.toContain('ada@example.com');
		expect(serialized).not.toContain('0123456789');
		expect(line.msg).toBe('probe');
		expect(line.errorName).toBe('AxiosError');
		expect(line.message).toBe('Request failed with status code 400');
		expect(line.code).toBe('ERR_BAD_REQUEST');
		expect(line.status).toBe(400);
		expect(line.orderId).toBe('order-1');
		expect(error.config?.headers?.Authorization).toBe(`Bearer ${secret}`);
	});

	test('treats an array index as a segment, and stops after four', () => {
		let deep: Record<string, unknown> = { account_number: '0123456789' };

		for (let i = 0; i < 5; i++) deep = { nested: deep };

		const line = logLine({
			responseData: { data: [{ account_number: '9988776655' }] },
			deep
		});

		expect(line.responseData.data[0].account_number).toBe('[REDACTED]');
		expect(JSON.stringify(line.deep)).toContain('0123456789');
	});
});
