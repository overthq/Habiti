import 'core-js/full/symbol/async-iterator';
import { ThemeProvider } from '@market/components';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/navigation/Routes';
import useStore from './src/state';

const App: React.FC = () => {
	const theme = useStore(({ theme }) => theme);

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Routes />
				</GestureHandlerRootView>
			</ThemeProvider>
		</SafeAreaProvider>
	);
};

export default App;
