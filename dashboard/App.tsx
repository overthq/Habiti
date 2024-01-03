import 'core-js/full/symbol/async-iterator';
import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/navigation/Routes';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
