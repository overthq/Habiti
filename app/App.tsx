import React from 'react';
import { Provider as StateProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/redux/store';
import Routes from './src/navigation/Routes';

const App = () => {
	return (
		<StateProvider store={store}>
			<PersistGate persistor={persistor}>
				<SafeAreaProvider>
					<Routes />
				</SafeAreaProvider>
			</PersistGate>
		</StateProvider>
	);
};

export default App;
