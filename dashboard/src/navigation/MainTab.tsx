import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Overview from '../screens/Overview';
import Store from '../screens/Store';

import OrdersStackNavigator from './OrdersStack';
import ProductsStackNavigator from './ProductsStack';

import { Icon } from '../components/icons';
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
			tabBarShowLabel: false
		})}
	>
		<MainTab.Screen name='Overview' component={Overview} />
		<MainTab.Group screenOptions={{ headerShown: false }}>
			<MainTab.Screen name='Orders'>
				{() => <OrdersStackNavigator />}
			</MainTab.Screen>
			<MainTab.Screen name='Products'>
				{() => <ProductsStackNavigator />}
			</MainTab.Screen>
		</MainTab.Group>
		<MainTab.Screen name='Store' component={Store} />
	</MainTab.Navigator>
);

export default MainTabNavigator;
