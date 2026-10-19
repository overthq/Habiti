import { describe, expect, test } from 'bun:test';
import { AxiosError, AxiosHeaders } from 'axios';
import pino from 'pino';

import { rootLogger } from './logger';

describe('err serializer', () => {
	test('drops the request config, and with it the bearer token, from Axios errors', () => {
		const config = {
			headers: new AxiosHeaders({ Authorization: 'Bearer sk_live_secret' }),
			data: '{"authorization_code":"AUTH_secret"}'
		};
		const error = new AxiosError(
			'Request failed with status code 400',
			'ERR_BAD_REQUEST',
			config,
			{},
			{ status: 400, statusText: 'Bad Request', headers: {}, config, data: {} }
		);

		const serializers = (rootLogger as any)[pino.symbols.serializersSym];
		const serialized = JSON.stringify(serializers.err(error));

		expect(serialized).not.toContain('sk_live_secret');
		expect(serialized).not.toContain('AUTH_secret');
		expect(serialized).toContain('ERR_BAD_REQUEST');
		expect(serialized).toContain('Request failed with status code 400');
	});
});
