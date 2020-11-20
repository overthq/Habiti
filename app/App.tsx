import React from 'react';
import { Provider, createClient } from 'urql';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppSelector } from './src/redux/store';
import Routes from './src/navigation/Routes';
import env from './env';

const App = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	const client = createClient({
		url: env.hasuraUrl,
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		})
	});

	return (
		<Provider value={client}>
			<SafeAreaProvider>
				<Routes accessToken={accessToken} />
			</SafeAreaProvider>
		</Provider>
	);
};

export default App;
