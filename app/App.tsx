import 'core-js/full/symbol/async-iterator';
import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/navigation/Routes';

const App: React.FC = () => (
	<SafeAreaProvider>
		<Routes />
	</SafeAreaProvider>
);

export default App;
