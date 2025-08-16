import React from 'react';
import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useShallow } from 'zustand/react/shallow';
import * as Updates from 'expo-updates';

import { AppStack } from './AppStack';
import MainTabNavigator from './MainTab';
import ModalGroup from './ModalGroup';
import Authenticate from '../screens/Authenticate';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import StoreSelect from '../screens/StoreSelect';
import Verify from '../screens/Verify';
import useStore from '../state';

const Routes: React.FC = () => {
	const { isUpdatePending } = Updates.useUpdates();

	React.useEffect(() => {
		if (isUpdatePending) {
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

	const { theme } = useTheme();
	const { accessToken, activeStore } = useStore(
		useShallow(state => ({
			accessToken: state.accessToken,
			activeStore: state.activeStore
		}))
	);

	return (
		<NavigationContainer theme={theme.navigation}>
			<StatusBar style={theme.statusBar} />
			<AppStack.Navigator
				id='AppStack'
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
		</NavigationContainer>
	);
};

export default Routes;
