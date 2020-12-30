import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/redux/store';
import Routes from './src/navigation/Routes';

const App = () => (
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<SafeAreaProvider>
				<Routes />
			</SafeAreaProvider>
		</PersistGate>
	</Provider>
);

export default App;
