import React from 'react';
import { createClient, fetchExchange } from 'urql';
import * as SecureStore from 'expo-secure-store';
import { useShallow } from 'zustand/react/shallow';

import env from '../../env';
import useStore from '../state';
import customCache from '../utils/cache';
import { refreshAuthTokens } from '../utils/refreshManager';

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
							const data = await refreshAuthTokens();

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
