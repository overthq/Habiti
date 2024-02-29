import 'core-js/full/symbol/async-iterator';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/contexts/ThemeContext';
import Routes from './src/navigation/Routes';

const App: React.FC = () => (
	<SafeAreaProvider>
		<ThemeProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Routes />
			</GestureHandlerRootView>
		</ThemeProvider>
	</SafeAreaProvider>
);

export default App;
