import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'urql';

import { AppStack } from './AppStack';
import MainTabNavigator from './MainTab';
import ModalGroup from './ModalGroup';
import useClient from '../hooks/useClient';
import Authenticate from '../screens/Authenticate';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import StoreSelect from '../screens/StoreSelect';
import Verify from '../screens/Verify';
import useStore from '../state';
import { getStatusBarStyle } from '../utils/theme';

const Routes: React.FC = () => {
	const { name, theme } = useTheme();
	const client = useClient();
	const { accessToken, activeStore } = useStore(state => ({
		accessToken: state.accessToken,
		activeStore: state.activeStore
	}));

	return (
		<Provider value={client}>
			<StatusBar style={getStatusBarStyle(name)} />
			<NavigationContainer theme={theme.navigation}>
				<BottomSheetModalProvider>
					<AppStack.Navigator
						initialRouteName={
							accessToken ? (!activeStore ? 'StoreSelect' : 'Main') : 'Landing'
						}
						screenOptions={{ headerShown: false }}
					>
						{accessToken ? (
							!activeStore ? (
								<AppStack.Group>
									<AppStack.Screen name='StoreSelect' component={StoreSelect} />
								</AppStack.Group>
							) : (
								<>
									<AppStack.Screen name='Main' component={MainTabNavigator} />
									{ModalGroup}
								</>
							)
						) : (
							<AppStack.Group>
								<AppStack.Screen name='Landing' component={Landing} />
								<AppStack.Screen name='Register' component={Register} />
								<AppStack.Screen name='Authenticate' component={Authenticate} />
								<AppStack.Screen name='Verify' component={Verify} />
							</AppStack.Group>
						)}
					</AppStack.Navigator>
				</BottomSheetModalProvider>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
