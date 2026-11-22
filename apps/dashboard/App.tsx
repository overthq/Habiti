import React from 'react';
import { Platform } from 'react-native';
import { ThemeProvider } from '@habiti/components';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { configureApi } from '@habiti/data';
import * as SplashScreen from 'expo-splash-screen';

import { SheetHost } from './src/navigation/Sheets';
import Routes from './src/navigation/Routes';
import useStore from './src/state';
import { useAuthRefreshQuery } from './src/data/queries';
import { queryClient } from './src/lib/queryClient';
import { refreshAuthTokens } from './src/lib/auth';
import env from './src/lib/env';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });

// refreshAuthTokens ends the session itself when the refresh token is rejected.
configureApi({
	baseURL: env.apiUrl,
	getAccessToken: () => useStore.getState().accessToken,
	refreshAccessToken: async () => {
		await refreshAuthTokens();
	}
});

useStore.subscribe((state, prevState) => {
	if (state.activeStore && state.activeStore !== prevState.activeStore) {
		queryClient.invalidateQueries({ queryKey: ['stores', 'current'] });
	}
});

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
			<KeyboardProvider>
				<ThemeProvider theme={theme}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<BottomSheetModalProvider>
							<Routes />
							{Platform.OS === 'android' && <SheetHost />}
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</KeyboardProvider>
		</SafeAreaProvider>
	);
};

export default Sentry.wrap(App);
