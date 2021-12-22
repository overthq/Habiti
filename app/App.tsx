import 'react-native-gesture-handler';
import React from 'react';
import { Provider as StateProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { MonoProvider } from '@mono.co/connect-react-native';

import { store, persistor } from './src/redux/store';
import Routes from './src/navigation/Routes';
// import monoConfig from './src/utils/mono';

const App: React.FC = () => (
	<StateProvider store={store}>
		<PersistGate persistor={persistor}>
			{/* <MonoProvider {...monoConfig}> */}
			<SafeAreaProvider>
				<Routes />
			</SafeAreaProvider>
			{/* </MonoProvider> */}
		</PersistGate>
	</StateProvider>
);

export default App;
