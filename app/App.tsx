import React from 'react';
import { Provider as StateProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, createClient } from 'urql';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/redux/store';
import Routes from './src/navigation/Routes';
import env from './env';

const App = () => {
	const {
		auth: { accessToken }
	} = store.getState();

	const client = createClient({
		url: env.hasuraUrl,
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		})
	});

	return (
		<StateProvider store={store}>
			<PersistGate persistor={persistor}>
				<Provider value={client}>
					<SafeAreaProvider>
						<Routes accessToken={accessToken} />
					</SafeAreaProvider>
				</Provider>
			</PersistGate>
		</StateProvider>
	);
};

export default App;
