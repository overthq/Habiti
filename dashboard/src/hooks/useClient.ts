import React from 'react';
import { createClient, fetchExchange } from 'urql';
import env from '../../env';
import useStore from '../state';
import customCache from '../utils/cache';
import { shallow } from 'zustand/shallow';

const useClient = () => {
	const { accessToken, activeStore } = useStore(
		state => ({
			accessToken: state.accessToken,
			activeStore: state.activeStore
		}),
		shallow
	);

	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
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
