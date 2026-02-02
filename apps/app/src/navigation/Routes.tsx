import React from 'react';
import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'urql';
import { useShallow } from 'zustand/react/shallow';
import * as Updates from 'expo-updates';

import AddCardWebview from '../screens/AddCardWebview';
import AddDeliveryAddress from '../screens/AddDeliveryAddress';
import Authenticate from '../screens/Authenticate';
import Cart from '../screens/Cart';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import Product from '../screens/Product';
import Verify from '../screens/Verify';
import Carts from '../screens/Carts';
import AccountSettings from '../screens/AccountSettings';
import DeliveryAddress from '../screens/DeliveryAddress';
import EditProfile from '../screens/EditProfile';
import NotificationSettings from '../screens/NotificationSettings';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SettingsTheme from '../screens/SettingsTheme';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import Store from '../screens/Store';
import Orders from '../screens/Orders';
import FollowedStores from '../screens/FollowedStores';

import useStore from '../state';
import useClient from '../hooks/useClient';

import {
	HomeStackParamList,
	AppStackParamList,
	ProfileStackParamList
} from '../types/navigation';

// const prefix = Linking.createURL('/');

const AppStack = createNativeStackNavigator<AppStackParamList, 'AppStack'>();

const ProfileNavigator = createNativeStackNavigator<
	ProfileStackParamList,
	'ProfileStack'
>();

const HomeNavigator = createNativeStackNavigator<
	HomeStackParamList,
	'HomeStack'
>();

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator id='HomeStack'>
			<HomeNavigator.Screen
				name='Home.Main'
				component={Home}
				options={{ headerShown: false }}
			/>
			<HomeNavigator.Screen
				name='Home.Order'
				component={Order}
				options={{ headerTitle: 'Order' }}
			/>
			<HomeNavigator.Screen
				name='Home.Notifications'
				component={Notifications}
				options={{ headerTitle: 'Notifications' }}
			/>
			<HomeNavigator.Screen
				name='Home.Store'
				component={Store}
				options={{ headerShown: false }}
			/>
			<HomeNavigator.Screen
				name='Home.Orders'
				component={Orders}
				options={{ headerTitle: 'Orders' }}
			/>
			<HomeNavigator.Screen
				name='Home.FollowedStores'
				component={FollowedStores}
				options={{ headerTitle: 'Followed stores' }}
			/>
		</HomeNavigator.Navigator>
	);
};

const ProfileStack = () => {
	return (
		<ProfileNavigator.Navigator id='ProfileStack'>
			<ProfileNavigator.Screen
				name='Profile.Main'
				component={Profile}
				options={{ headerTitle: 'Profile' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.Edit'
				component={EditProfile}
				options={{ headerTitle: 'Edit Profile' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.PaymentMethods'
				component={PaymentMethods}
				options={{ headerTitle: 'Payment Methods' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.DeliveryAddress'
				component={DeliveryAddress}
				options={{ headerTitle: 'Delivery Address' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.NotificationSettings'
				component={NotificationSettings}
				options={{ headerTitle: 'Notifications' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.Appearance'
				component={SettingsTheme}
				options={{ headerTitle: 'Appearance' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.AccountSettings'
				component={AccountSettings}
				options={{ headerTitle: 'Account Settings' }}
			/>
		</ProfileNavigator.Navigator>
	);
};

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
