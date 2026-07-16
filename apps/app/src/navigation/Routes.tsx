import React from 'react';
import { Icon, IconType, themes, useTheme } from '@habiti/components';
import {
	LinkingOptions,
	NavigationContainer,
	RouteProp
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Linking } from 'react-native';
import * as ExpoNotifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';

import AddCardWebview from '../screens/AddCardWebview';
import AddAddress from '../screens/AddAddress';
import Cart from '../screens/Cart';
import Register from '../screens/Register';
import Product from '../screens/Product';
import Verify from '../screens/Verify';
import Carts from '../screens/Carts';
import AccountSettings from '../screens/AccountSettings';
import Addresses from '../screens/Addresses';
import EditAddress from '../screens/EditAddress';
import EditProfile from '../screens/EditProfile';
import NotificationSettings from '../screens/NotificationSettings';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SettingsTheme from '../screens/SettingsTheme';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import Store from '../screens/Store';
import StoreInfo from '../screens/StoreInfo';
import Orders from '../screens/Orders';
import FollowedStores from '../screens/FollowedStores';
import SignIn from '../screens/SignIn';

import {
	HomeStackParamList,
	AppStackParamList,
	AuthStackParamList,
	MainTabParamList,
	ProfileStackParamList
} from '../navigation/types';

ExpoNotifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true
	})
});

const linking: LinkingOptions<AppStackParamList> = {
	prefixes: ['habiti://', 'https://habiti.app'],
	config: {
		screens: {
			'App.Main': {
				screens: {
					'Main.Home': {
						screens: {
							'Home.Main': 'home',
							'Home.Order': 'orders/:orderId',
							'Home.Orders': 'orders',
							'Home.Store': 'store/:storeId',
							'Home.Notifications': 'notifications',
							'Home.FollowedStores': 'followed-stores'
						}
					},
					'Main.Carts': 'carts',
					'Main.Profile': {
						screens: {
							'Profile.Main': 'profile'
						}
					}
				}
			},
			Cart: 'carts/:cartId',
			Product: 'product/:productId'
		}
	},
	async getInitialURL() {
		const url = await Linking.getInitialURL();

		if (url != null) {
			return url;
		}

		const response = ExpoNotifications.getLastNotificationResponse();

		return (
			(response?.notification.request.content.data?.url as string) ?? undefined
		);
	},
	subscribe(listener) {
		const onReceiveURL = ({ url }: { url: string }) => listener(url);

		const eventListenerSubscription = Linking.addEventListener(
			'url',
			onReceiveURL
		);

		const subscription =
			ExpoNotifications.addNotificationResponseReceivedListener(response => {
				const url = response.notification.request.content.data?.url;

				if (typeof url === 'string') {
					listener(url);
				}
			});

		return () => {
			eventListenerSubscription.remove();
			subscription.remove();
		};
	}
};

const AppStack = createNativeStackNavigator<AppStackParamList, 'AppStack'>();

const MainTab = createBottomTabNavigator<MainTabParamList, 'MainTab'>();

const ProfileNavigator = createNativeStackNavigator<
	ProfileStackParamList,
	'ProfileStack'
>();

const HomeNavigator = createNativeStackNavigator<
	HomeStackParamList,
	'HomeStack'
>();

const AuthNavigator = createNativeStackNavigator<
	AuthStackParamList,
	'AuthStack'
>();

const AuthStack = () => {
	return (
		<AuthNavigator.Navigator
			id='AuthStack'
			screenOptions={{
				headerTitle: '',
				headerBackButtonDisplayMode: 'minimal'
			}}
		>
			<AuthNavigator.Screen
				name='Auth.Main'
				component={SignIn}
				options={({ navigation }) => ({
					unstable_headerLeftItems: () => [
						{
							type: 'button',
							label: 'Close',
							icon: { type: 'sfSymbol', name: 'xmark' },
							onPress: navigation.goBack
						}
					]
				})}
			/>
			<AuthNavigator.Screen name='Auth.Register' component={Register} />
			<AuthNavigator.Screen name='Auth.Verify' component={Verify} />
		</AuthNavigator.Navigator>
	);
};

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator
			id='HomeStack'
			screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}
		>
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
		<ProfileNavigator.Navigator
			id='ProfileStack'
			screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}
		>
			<ProfileNavigator.Screen
				name='Profile.Main'
				component={Profile}
				options={{ headerTransparent: true, headerTitle: 'Profile' }}
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
				name='Profile.Addresses'
				component={Addresses}
				options={{ headerTitle: 'Addresses' }}
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

const tabIcons: Record<keyof MainTabParamList, IconType> = {
	'Main.Home': 'home',
	'Main.Carts': 'shopping-basket',
	'Main.Profile': 'user-round'
};

const tabLabels: Record<keyof MainTabParamList, string> = {
	'Main.Home': 'Home',
	'Main.Carts': 'Carts',
	'Main.Profile': 'Profile'
};

const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<MainTabParamList> }) => ({
		headerShown: false,
		title: tabLabels[route.name],
		tabBarActiveTintColor: themes[themeName].text.primary,
		tabBarInactiveTintColor: themes[themeName].text.tertiary,
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={tabIcons[route.name]} color={color} size={28} />
		),
		tabBarStyle: { paddingTop: 8 }
	});

const MainTabs = () => {
	const { name } = useTheme();

	return (
		<MainTab.Navigator
			id='MainTab'
			initialRouteName='Main.Home'
			screenOptions={tabScreenOptions(name)}
		>
			<MainTab.Screen name='Main.Home' component={HomeStack} />
			<MainTab.Screen name='Main.Carts' component={Carts} />
			<MainTab.Screen name='Main.Profile' component={ProfileStack} />
		</MainTab.Navigator>
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

	return (
		<>
			<StatusBar style={theme.statusBar} />
			<NavigationContainer theme={theme.navigation} linking={linking}>
				<AppStack.Navigator
					id='AppStack'
					screenOptions={{ headerShown: false }}
				>
					<AppStack.Screen name='App.Main' component={MainTabs} />
					<AppStack.Group
						screenOptions={({ navigation }) => ({
							headerShown: true,
							presentation: 'containedModal',
							headerBackButtonDisplayMode: 'minimal',
							unstable_headerLeftItems: () => [
								{
									type: 'button',
									label: 'Close',
									icon: { type: 'sfSymbol', name: 'xmark' },
									onPress: navigation.goBack
								}
							]
						})}
					>
						<AppStack.Screen name='Cart' component={Cart} />
						<AppStack.Screen
							name='Product'
							component={Product}
							options={{
								headerTitle: '',
								gestureDirection: 'vertical',
								headerTransparent: true
							}}
						/>
						<AppStack.Screen
							name='Modal.AddCard'
							component={AddCardWebview}
							options={{ headerTitle: 'Add Card' }}
						/>
						<AppStack.Screen
							name='Modal.AddAddress'
							component={AddAddress}
							options={{ headerTitle: 'Add Address' }}
						/>
						<AppStack.Screen
							name='Modal.EditAddress'
							component={EditAddress}
							options={{ headerTitle: 'Edit Address' }}
						/>
						<AppStack.Screen
							name='Modal.StoreInfo'
							component={StoreInfo}
							options={{ headerTitle: 'Store Info' }}
						/>
					</AppStack.Group>
					<AppStack.Screen
						name='Modal.Auth'
						component={AuthStack}
						options={{ presentation: 'modal' }}
					/>
				</AppStack.Navigator>
			</NavigationContainer>
		</>
	);
};

export default Routes;
