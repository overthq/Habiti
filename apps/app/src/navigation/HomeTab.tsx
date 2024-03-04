import { useTheme } from '@market/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Carts from '../screens/Carts';
import EditProfile from '../screens/EditProfile';
import Explore from '../screens/Explore';
import Home from '../screens/Home';
import Order from '../screens/Order';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SearchStore from '../screens/SearchStore';
import Settings from '../screens/Settings';
import SettingsTheme from '../screens/SettingsTheme';
import Store from '../screens/Store';
import {
	CartStackParamList,
	ExploreStackParamList,
	HomeStackParamList,
	HomeTabParamList,
	ProfileStackParamList
} from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigator = createStackNavigator<HomeStackParamList>();
const ExploreNavigator = createStackNavigator<ExploreStackParamList>();
const CartsNavigator = createStackNavigator<CartStackParamList>();
const ProfileNavigator = createStackNavigator<ProfileStackParamList>();

const HomeThing = () => {
	return (
		<HomeNavigator.Navigator>
			<HomeNavigator.Screen name='Home' component={Home} />
			<HomeNavigator.Screen name='Order' component={Order} />
			<HomeNavigator.Screen
				name='Store'
				component={Store}
				options={{ headerTitle: '' }}
			/>
			<HomeNavigator.Screen name='Settings' component={Settings} />
			<HomeNavigator.Screen name='SettingsTheme' component={SettingsTheme} />
		</HomeNavigator.Navigator>
	);
};

const ExploreThing = () => {
	return (
		<ExploreNavigator.Navigator>
			<ExploreNavigator.Screen name='Explore.Main' component={Explore} />
			<ExploreNavigator.Screen
				name='Store'
				component={Store}
				options={{ headerTitle: '' }}
			/>
			<ExploreNavigator.Screen
				name='SearchStore'
				component={SearchStore}
				options={{ headerShown: false }}
			/>
		</ExploreNavigator.Navigator>
	);
};

const CartsThing = () => {
	return (
		<CartsNavigator.Navigator>
			<CartsNavigator.Screen name='Carts.Main' component={Carts} />
		</CartsNavigator.Navigator>
	);
};

const ProfileThing = () => {
	return (
		<ProfileNavigator.Navigator>
			<ProfileNavigator.Screen name='Profile.Main' component={Profile} />
			<ProfileNavigator.Screen name='Edit Profile' component={EditProfile} />
			<ProfileNavigator.Screen
				name='Payment Methods'
				component={PaymentMethods}
			/>
		</ProfileNavigator.Navigator>
	);
};

const HomeTabNavigator = () => {
	const { name } = useTheme();

	return (
		<HomeTab.Navigator screenOptions={tabScreenOptions(name)}>
			<HomeTab.Screen name='For You' component={HomeThing} />
			<HomeTab.Screen name='Explore' component={ExploreThing} />
			<HomeTab.Screen name='Carts' component={CartsThing} />
			<HomeTab.Screen name='Profile' component={ProfileThing} />
		</HomeTab.Navigator>
	);
};

export default HomeTabNavigator;
