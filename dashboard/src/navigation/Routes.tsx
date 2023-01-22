import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'urql';

import Register from '../screens/Register';
import Authenticate from '../screens/Authenticate';
import Verify from '../screens/Verify';
import StoreSelect from '../screens/StoreSelect';
import CreateStore from '../screens/CreateStore';

import useClient from '../hooks/useClient';
import MainTabNavigator from './MainTab';
import useStore from '../state';
import { AppStack } from './AppStack';
import ModalGroup from './ModalGroup';
import { StatusBar } from 'expo-status-bar';
import { getStatusBarStyle } from '../utils/theme';

const Routes: React.FC = () => {
	const client = useClient();
	const { accessToken, activeStore, theme } = useStore(state => ({
		accessToken: state.accessToken,
		activeStore: state.activeStore,
		theme: state.theme
	}));

	return (
		<Provider value={client}>
			<StatusBar style={getStatusBarStyle(theme)} />
			<NavigationContainer>
				<AppStack.Navigator>
					{accessToken ? (
						!activeStore ? (
							<AppStack.Group screenOptions={{ headerShown: false }}>
								<AppStack.Screen name='StoreSelect' component={StoreSelect} />
								<AppStack.Screen name='CreateStore' component={CreateStore} />
							</AppStack.Group>
						) : (
							<>
								<AppStack.Screen
									name='Main'
									component={MainTabNavigator}
									options={{ headerShown: false }}
								/>
								{ModalGroup}
							</>
						)
					) : (
						<AppStack.Group>
							<AppStack.Screen name='Register' component={Register} />
							<AppStack.Screen name='Authenticate' component={Authenticate} />
							<AppStack.Screen name='Verify' component={Verify} />
						</AppStack.Group>
					)}
				</AppStack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
