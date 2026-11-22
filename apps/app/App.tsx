// import 'core-js/full/symbol/async-iterator';
import { ThemeProvider } from '@habiti/components';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useShallow } from 'zustand/react/shallow';
import { configureApi } from '@habiti/data';

import Routes from './src/navigation/Routes';
import useStore from './src/state';
import { useSessionQuery } from './src/data/queries';
import { ensureSession } from './src/utils/refreshManager';
import env from './env';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });

// An unrecoverable session degrades to a fresh guest session so the app stays
// usable; only an offline failure of that too logs out to Landing.
configureApi({
	baseURL: env.apiUrl,
	getAccessToken: () => useStore.getState().accessToken,
	refreshAccessToken: async () => {
		await ensureSession();
	},
	onSessionExpired: () => useStore.getState().logOut()
});

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AppInner />
		</QueryClientProvider>
	);
};

const AppInner = () => {
	const theme = useStore(useShallow(({ theme }) => theme));
	const { isFetched } = useSessionQuery();

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
			<KeyboardProvider>
				<ThemeProvider theme={theme}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<BottomSheetModalProvider>
							<Routes />
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</KeyboardProvider>
		</SafeAreaProvider>
	);
};

export default Sentry.wrap(App);
