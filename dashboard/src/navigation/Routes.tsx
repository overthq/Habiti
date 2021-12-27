import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'urql';

import Register from '../screens/Register';
import Authenticate from '../screens/Authenticate';
import Verify from '../screens/Verify';
import AddProduct from '../screens/AddProduct';
import EditProduct from '../screens/EditProduct';
import StoreSelect from '../screens/StoreSelect';
import CreateStore from '../screens/CreateStore';

import { useAppSelector } from '../redux/store';
import { AppStackParamList } from '../types/navigation';
import useClient from '../hooks/useClient';
import MainTabNavigator from './MainTab';
import SettingsStackNavigator from './SettingsStack';

const AppStack = createStackNavigator<AppStackParamList>();

const Routes: React.FC = () => {
	const client = useClient();
	const { accessToken, activeStore } = useAppSelector(
		({ auth, preferences }) => ({
			accessToken: auth.accessToken,
			activeStore: preferences.activeStore
		})
	);

	return (
		<Provider value={client}>
			<NavigationContainer>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							{!activeStore ? (
								<AppStack.Group>
									<AppStack.Screen name='StoreSelect' component={StoreSelect} />
									<AppStack.Screen name='CreateStore' component={CreateStore} />
								</AppStack.Group>
							) : (
								<>
									<AppStack.Screen name='Main' component={MainTabNavigator} />
									<AppStack.Group
										screenOptions={{ presentation: 'modal', headerShown: true }}
									>
										<AppStack.Screen
											name='Add Product'
											component={AddProduct}
										/>
										<AppStack.Screen
											name='Edit Product'
											component={EditProduct}
										/>
										<AppStack.Screen
											name='Settings'
											options={{ headerShown: false }}
											component={SettingsStackNavigator}
										/>
									</AppStack.Group>
								</>
							)}
						</>
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
