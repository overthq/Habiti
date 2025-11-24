import React from 'react';
import { createClient, fetchExchange } from 'urql';

import env from '../../env';
import useStore from '../state';
import customCache from '../utils/cache';
import { useShallow } from 'zustand/react/shallow';
import * as SecureStore from 'expo-secure-store';

const useClient = () => {
	const { accessToken, activeStore } = useStore(
		useShallow(state => ({
			accessToken: state.accessToken,
			activeStore: state.activeStore
		}))
	);

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
				fetchOptions: () => ({
					headers: {
						authorization: accessToken ? `Bearer ${accessToken}` : '',
						'x-market-store-id': activeStore ?? ''
					}
				}),
				exchanges: [customCache, fetchExchange]
			}),
		[accessToken, activeStore]
	);

	return client;
};

export default useClient;
