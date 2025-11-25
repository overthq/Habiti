import 'core-js/full/symbol/async-iterator';
import { ThemeProvider } from '@habiti/components';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import Routes from './src/navigation/Routes';
import useStore from './src/state';
import { useShallow } from 'zustand/react/shallow';
import { useAuthRefreshQuery } from './src/data/queries';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AppInner />
		</QueryClientProvider>
	);
};

const AppInner = () => {
	const theme = useStore(useShallow(({ theme }) => theme));
	const { isFetched } = useAuthRefreshQuery();

	React.useEffect(() => {
		if (isFetched) {
			SplashScreen.hide();
		}
	}, [isFetched]);

	if (!isFetched) {
		return null;
	}

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
