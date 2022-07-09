import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'urql';

import Authenticate from '../screens/Authenticate';
import Register from '../screens/Register';
import Verify from '../screens/Verify';
import Store from '../screens/Store';
import Product from '../screens/Product';
import Cart from '../screens/Cart';
import Order from '../screens/Order';
import EditProfile from '../screens/EditProfile';
import AddCardWebview from '../screens/AddCardWebview';

import HomeTabNavigator from './HomeTab';
import { AppStackParamList } from '../types/navigation';
import useClient from '../hooks/useClient';
import PaymentMethods from '../screens/PaymentMethods';
import { getStatusBarStyle } from '../utils/theme';
import useStore from '../state';

const AppStack = createStackNavigator<AppStackParamList>();

const Routes: React.FC = () => {
	const { accessToken, theme } = useStore(state => ({
		accessToken: state.accessToken,
		theme: state.theme
	}));

	const client = useClient(accessToken);

	return (
		<Provider value={client}>
			<StatusBar style={getStatusBarStyle(theme)} />
			<NavigationContainer>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							<AppStack.Screen name='Home' component={HomeTabNavigator} />
							<AppStack.Screen
								name='Store'
								component={Store}
								options={{ headerShown: true, headerTitle: '' }}
							/>
							<AppStack.Group screenOptions={{ presentation: 'modal' }}>
								<AppStack.Screen name='Product' component={Product} />
								<AppStack.Screen name='Cart' component={Cart} />
								<AppStack.Group screenOptions={{ headerShown: true }}>
									<AppStack.Screen name='Order' component={Order} />
									<AppStack.Screen
										name='Edit Profile'
										component={EditProfile}
									/>
									<AppStack.Screen name='Add Card' component={AddCardWebview} />
									<AppStack.Screen
										name='Payment Methods'
										component={PaymentMethods}
									/>
								</AppStack.Group>
							</AppStack.Group>
						</>
					) : (
						<>
							<AppStack.Screen name='Register' component={Register} />
							<AppStack.Screen name='Authenticate' component={Authenticate} />
							<AppStack.Screen name='Verify' component={Verify} />
						</>
					)}
				</AppStack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
