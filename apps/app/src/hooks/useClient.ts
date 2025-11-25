import React from 'react';
import { createClient, fetchExchange } from 'urql';

import env from '../../env';
import customCache from '../utils/cache';
import useStore from '../state';
import * as SecureStore from 'expo-secure-store';
import { refreshAuthTokens } from '../utils/refreshManager';

const useClient = (accessToken: string | null) => {
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
