import 'core-js/full/symbol/async-iterator';
import { ThemeProvider } from '@habiti/components';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';

import { ConfirmationModalProvider } from './src/components/ConfirmationModal';
import Routes from './src/navigation/Routes';
import useStore from './src/state';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });

const queryClient = new QueryClient();

const App: React.FC = () => {
	const theme = useStore(useShallow(({ theme }) => theme));

	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
};

export default App;
