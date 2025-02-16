import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'urql';
import { useShallow } from 'zustand/shallow';

import MainTabNavigator from './MainTab';
import useClient from '../hooks/useClient';
import AddCardWebview from '../screens/AddCardWebview';
import AddDeliveryAddress from '../screens/AddDeliveryAddress';
import Authenticate from '../screens/Authenticate';
import Cart from '../screens/Cart';
import Landing from '../screens/Landing';
import Onboarding from '../screens/Onboarding';
import Product from '../screens/Product';
import Verify from '../screens/Verify';
import useStore from '../state';
import { AppStackParamList } from '../types/navigation';

// const prefix = Linking.createURL('/');

const AppStack = createNativeStackNavigator<AppStackParamList>();

const Routes: React.FC = () => {
	const { theme } = useTheme();
	const { accessToken } = useStore(
		useShallow(state => ({
			accessToken: state.accessToken
		}))
	);
	const client = useClient(accessToken);

	// const linking = {
	// 	prefixes: [prefix, 'https://habiti.app']
	// };

	return (
		<Provider value={client}>
			<StatusBar style={theme.statusBar} />
			<NavigationContainer theme={theme.navigation} /*linking={linking}*/>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							<AppStack.Screen name='Main' component={MainTabNavigator} />
							<AppStack.Group screenOptions={{ headerShown: true }}>
								<AppStack.Screen name='Cart' component={Cart} />
								<AppStack.Group screenOptions={{ presentation: 'modal' }}>
									<AppStack.Screen
										name='Product'
										component={Product}
										options={{ headerTitle: '', gestureDirection: 'vertical' }}
									/>
									<AppStack.Screen name='Add Card' component={AddCardWebview} />
									<AppStack.Screen
										name='Modal.AddDeliveryAddress'
										component={AddDeliveryAddress}
										options={{ headerTitle: 'Add Delivery Address' }}
									/>
								</AppStack.Group>
							</AppStack.Group>
						</>
					) : (
						<>
							<AppStack.Screen name='Landing' component={Landing} />
							<AppStack.Screen name='Register' component={Onboarding} />
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
