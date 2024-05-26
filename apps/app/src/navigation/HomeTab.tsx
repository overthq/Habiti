import { useTheme } from '@market/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Carts from '../screens/Carts';
import DeliveryAddress from '../screens/DeliveryAddress';
import EditProfile from '../screens/EditProfile';
import Explore from '../screens/Explore';
import Home from '../screens/Home';
import NotificationSettings from '../screens/NotificationSettings';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SearchStore from '../screens/SearchStore';
import SettingsTheme from '../screens/SettingsTheme';
import Store from '../screens/Store';
import {
	CartStackParamList,
	ExploreStackParamList,
	HomeStackParamList,
	HomeTabParamList,
	ProfileStackParamList,
	StoreStackParamList
} from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigator = createNativeStackNavigator<HomeStackParamList>();
const ExploreNavigator = createNativeStackNavigator<ExploreStackParamList>();
const CartsNavigator = createNativeStackNavigator<CartStackParamList>();
const ProfileNavigator = createNativeStackNavigator<ProfileStackParamList>();
const StoreNavigator = createNativeStackNavigator<StoreStackParamList>();

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator>
			<HomeNavigator.Screen name='Home' component={Home} />
			<HomeNavigator.Screen name='Order' component={Order} />
			<HomeNavigator.Screen name='Notifications' component={Notifications} />
			<HomeNavigator.Screen
				name='Store'
				component={StoreStack}
				options={{ headerShown: false }}
			/>
		</HomeNavigator.Navigator>
	);
};

const ExploreStack = () => {
	return (
		<ExploreNavigator.Navigator>
			<ExploreNavigator.Screen
				name='Explore.Main'
				component={Explore}
				options={{ headerShown: false }}
			/>
			<ExploreNavigator.Screen
				name='Store'
				component={StoreStack}
				options={{ headerShown: false }}
			/>
		</ExploreNavigator.Navigator>
	);
};

const CartsStack = () => {
	return (
		<CartsNavigator.Navigator>
			<CartsNavigator.Screen
				name='Carts.Main'
				component={Carts}
				options={{ headerTitle: 'Carts' }}
			/>
		</CartsNavigator.Navigator>
	);
};

const ProfileStack = () => {
	return (
		<ProfileNavigator.Navigator>
			<ProfileNavigator.Screen
				name='Profile.Main'
				component={Profile}
				options={{ headerTitle: 'Profile' }}
			/>
			<ProfileNavigator.Screen name='Edit Profile' component={EditProfile} />
			<ProfileNavigator.Screen
				name='Payment Methods'
				component={PaymentMethods}
			/>
			<ProfileNavigator.Screen
				name='DeliveryAddress'
				component={DeliveryAddress}
				options={{ headerTitle: 'Delivery Address' }}
			/>
			<ProfileNavigator.Screen
				name='NotificationSettings'
				component={NotificationSettings}
				options={{ headerTitle: 'Notifications' }}
			/>
			<ProfileNavigator.Screen name='Appearance' component={SettingsTheme} />
		</ProfileNavigator.Navigator>
	);
};

const StoreStack = () => {
	return (
		<StoreNavigator.Navigator>
			<StoreNavigator.Screen
				name='Store.Main'
				component={Store}
				options={{ headerTitle: '' }}
			/>
			<StoreNavigator.Screen
				name='Store.Search'
				component={SearchStore}
				options={{ headerShown: false }}
			/>
		</StoreNavigator.Navigator>
	);
};

const HomeTabNavigator = () => {
	const { name } = useTheme();

	return (
		<HomeTab.Navigator screenOptions={tabScreenOptions(name)}>
			<HomeTab.Screen name='For You' component={HomeStack} />
			<HomeTab.Screen name='Explore' component={ExploreStack} />
			<HomeTab.Screen name='Carts' component={CartsStack} />
			<HomeTab.Screen name='Profile' component={ProfileStack} />
		</HomeTab.Navigator>
	);
};

export default HomeTabNavigator;
