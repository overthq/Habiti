import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Carts from '../screens/Carts';
import Explore from '../screens/Explore';

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabNavigator = () => (
	<HomeTab.Navigator screenOptions={tabScreenOptions}>
		<HomeTab.Screen name='For You' component={Home} />
		<HomeTab.Screen name='Explore' component={Explore} />
		<HomeTab.Screen name='Carts' component={Carts} />
		<HomeTab.Screen name='Profile' component={Profile} />
	</HomeTab.Navigator>
);

export default HomeTabNavigator;
