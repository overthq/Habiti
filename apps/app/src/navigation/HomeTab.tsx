import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Carts from '../screens/Carts';
import Explore from '../screens/Explore';
import { createStackNavigator } from '@react-navigation/stack';
import Store from '../screens/Store';
import EditProfile from '../screens/EditProfile';
import PaymentMethods from '../screens/PaymentMethods';
import Order from '../screens/Order';

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigator = createStackNavigator();
const ExploreNavigator = createStackNavigator();
const CartsNavigator = createStackNavigator();
const ProfileNavigator = createStackNavigator();

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
		</HomeNavigator.Navigator>
	);
};

const ExploreThing = () => {
	return (
		<ExploreNavigator.Navigator>
			<ExploreNavigator.Screen name='Explore' component={Explore} />
			<ExploreNavigator.Screen
				name='Store'
				component={Store}
				options={{ headerTitle: '' }}
			/>
		</ExploreNavigator.Navigator>
	);
};

const CartsThing = () => {
	return (
		<CartsNavigator.Navigator>
			<CartsNavigator.Screen name='Carts' component={Carts} />
		</CartsNavigator.Navigator>
	);
};

const ProfileThing = () => {
	return (
		<ProfileNavigator.Navigator>
			<ProfileNavigator.Screen name='Profile' component={Profile} />
			<ProfileNavigator.Screen name='Edit Profile' component={EditProfile} />
			<ProfileNavigator.Screen
				name='Payment Methods'
				component={PaymentMethods}
			/>
		</ProfileNavigator.Navigator>
	);
};

const HomeTabNavigator = () => (
	<HomeTab.Navigator screenOptions={tabScreenOptions}>
		<HomeTab.Screen name='For You' component={HomeThing} />
		<HomeTab.Screen name='Explore' component={ExploreThing} />
		<HomeTab.Screen name='Carts' component={CartsThing} />
		<HomeTab.Screen name='Profile' component={ProfileThing} />
	</HomeTab.Navigator>
);

export default HomeTabNavigator;
