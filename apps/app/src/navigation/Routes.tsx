import React from 'react';
import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'urql';
import { useShallow } from 'zustand/react/shallow';
import * as Updates from 'expo-updates';

import useClient from '../hooks/useClient';
import AddCardWebview from '../screens/AddCardWebview';
import AddDeliveryAddress from '../screens/AddDeliveryAddress';
import Authenticate from '../screens/Authenticate';
import Cart from '../screens/Cart';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import Product from '../screens/Product';
import Verify from '../screens/Verify';
import useStore from '../state';
import { AppStackParamList } from '../types/navigation';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import Carts from '../screens/Carts';

// const prefix = Linking.createURL('/');

const AppStack = createNativeStackNavigator<AppStackParamList, 'AppStack'>();

const Routes: React.FC = () => {
	const { isUpdatePending } = Updates.useUpdates();

	React.useEffect(() => {
		if (isUpdatePending) {
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

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
				<AppStack.Navigator
					id='AppStack'
					screenOptions={{ headerShown: false }}
				>
					{accessToken ? (
						<>
							<AppStack.Screen name='App.Home' component={HomeStack} />
							<AppStack.Screen
								name='App.Carts'
								component={Carts}
								options={{ headerTitle: 'Carts' }}
							/>
							<AppStack.Group
								screenOptions={{ headerShown: true, presentation: 'modal' }}
							>
								<AppStack.Screen
									name='App.Profile'
									component={ProfileStack}
									options={{ headerShown: false, headerTitle: 'Profile' }}
								/>
								<AppStack.Screen name='Cart' component={Cart} />
								<AppStack.Screen
									name='Product'
									component={Product}
									options={{ headerTitle: '', gestureDirection: 'vertical' }}
								/>
								<AppStack.Screen
									name='Modal.AddCard'
									component={AddCardWebview}
									options={{ headerTitle: 'Add Card' }}
								/>
								<AppStack.Screen
									name='Modal.AddDeliveryAddress'
									component={AddDeliveryAddress}
									options={{ headerTitle: 'Add Delivery Address' }}
								/>
							</AppStack.Group>
						</>
					) : (
						<>
							<AppStack.Screen name='Landing' component={Landing} />
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
