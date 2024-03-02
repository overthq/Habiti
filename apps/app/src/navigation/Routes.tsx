import { useTheme } from '@market/components';
import {
	DarkTheme,
	DefaultTheme,
	NavigationContainer
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions } from 'react-native';
import { Provider } from 'urql';

import HomeTabNavigator from './HomeTab';
import useClient from '../hooks/useClient';
import AddCardWebview from '../screens/AddCardWebview';
import Authenticate from '../screens/Authenticate';
import Cart from '../screens/Cart';
import Order from '../screens/Order';
import Product from '../screens/Product';
import Register from '../screens/Register';
import Verify from '../screens/Verify';
import useStore from '../state';
import { AppStackParamList } from '../types/navigation';
import { getStatusBarStyle } from '../utils/theme';

const AppStack = createStackNavigator<AppStackParamList>();

const Routes: React.FC = () => {
	const { name } = useTheme();
	const { accessToken } = useStore(state => ({
		accessToken: state.accessToken
	}));
	const client = useClient(accessToken);

	return (
		<Provider value={client}>
			<StatusBar style={getStatusBarStyle(name)} />
			<NavigationContainer theme={name === 'dark' ? DarkTheme : DefaultTheme}>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							<AppStack.Screen name='Home' component={HomeTabNavigator} />
							<AppStack.Group screenOptions={{ headerShown: true }}>
								<AppStack.Screen name='Cart' component={Cart} />
								<AppStack.Group screenOptions={{ presentation: 'modal' }}>
									<AppStack.Screen
										name='Product'
										component={Product}
										options={{
											headerTitle: '',
											gestureDirection: 'vertical',
											gestureResponseDistance: Dimensions.get('window').height
										}}
									/>
									<AppStack.Screen name='Order' component={Order} />
									<AppStack.Screen name='Add Card' component={AddCardWebview} />
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
