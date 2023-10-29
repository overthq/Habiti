import 'core-js/full/symbol/async-iterator';
import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/navigation/Routes';
import { ThemeProvider } from './src/contexts/ThemeContext';

const App: React.FC = () => (
	<SafeAreaProvider>
		<ThemeProvider>
			<Routes />
		</ThemeProvider>
	</SafeAreaProvider>
);

export default App;
