import React from 'react';
import { createClient, fetchExchange } from 'urql';

import env from '../../env';
import customCache from '../utils/cache';
import useStore from '../state';
import * as SecureStore from 'expo-secure-store';

const useClient = (accessToken: string | null) => {
	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetch: async (resource, options) => {
					const response = await fetch(resource, options);

					if (response.status === 401) {
						try {
							const refreshToken =
								await SecureStore.getItemAsync('refreshToken');
							if (!refreshToken) throw new Error('No refresh token');

							const refreshResponse = await fetch(
								`${env.apiUrl}/auth/refresh`,
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										Cookie: `refreshToken=${refreshToken}`
									},
									body: JSON.stringify({ refreshToken })
								}
							);

							if (!refreshResponse.ok) throw new Error('Refresh failed');

							const data = await refreshResponse.json();
							useStore.getState().logIn(data.accessToken);
							await SecureStore.setItemAsync('refreshToken', data.refreshToken);

							// Retry original request with new token
							const newOptions = {
								...options,
								headers: {
									...options?.headers,
									authorization: `Bearer ${data.accessToken}`
								}
							};

							return fetch(resource, newOptions);
						} catch (error) {
							useStore.getState().logOut();
							await SecureStore.deleteItemAsync('refreshToken');
							return response;
						}
					}

					return response;
				},
				fetchOptions: {
					headers: {
						...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})
					}
				},
				exchanges: [customCache, fetchExchange]
			}),
		[accessToken]
	);

	return client;
};

export default useClient;
