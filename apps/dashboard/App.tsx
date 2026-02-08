import 'core-js/full/symbol/async-iterator';
import React from 'react';
import { ThemeProvider } from '@habiti/components';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import * as SplashScreen from 'expo-splash-screen';

import { ConfirmationModalProvider } from './src/components/ConfirmationModal';
import Routes from './src/navigation/Routes';
import useStore from './src/state';
import { useAuthRefreshQuery } from './src/data/queries';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });

const queryClient = new QueryClient();

useStore.subscribe((state, prevState) => {
	if (state.activeStore && state.activeStore !== prevState.activeStore) {
		queryClient.invalidateQueries({ queryKey: ['stores', 'current'] });
	}
});

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
					<BottomSheetModalProvider>
						<ConfirmationModalProvider>
							<Routes />
						</ConfirmationModalProvider>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</ThemeProvider>
		</SafeAreaProvider>
	);
};

export default App;
