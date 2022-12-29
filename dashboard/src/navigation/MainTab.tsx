import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStack';
import OrdersStackNavigator from './OrdersStack';
import ProductsStackNavigator from './ProductsStack';
import StoreStackNavigator from './StoreStack';

import { Icon } from '../components/Icon';
import { getIcon } from '../utils/navigation';
import { MainTabParamList } from '../types/navigation';

const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => (
	<MainTab.Navigator
		screenOptions={({ route }) => ({
			tabBarIcon: ({ color }) => (
				<Icon name={getIcon(route.name)} color={color} size={28} />
			),
			tabBarActiveTintColor: 'black',
			tabBarInactiveTintColor: 'gray',
			tabBarShowLabel: false,
			headerShown: false
		})}
	>
		<MainTab.Screen name='Home' component={HomeStackNavigator} />
		<MainTab.Screen name='Orders' component={OrdersStackNavigator} />
		<MainTab.Screen name='Products' component={ProductsStackNavigator} />
		<MainTab.Screen name='Store' component={StoreStackNavigator} />
	</MainTab.Navigator>
);

export default MainTabNavigator;
