import { useTheme, Icon } from '@habiti/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import HomeStackNavigator from './HomeStack';
import OrdersStackNavigator from './OrdersStack';
import ProductsStackNavigator from './ProductsStack';
import StoreStackNavigator from './StoreStack';
import { MainTabParamList } from '../types/navigation';
import { getIcon } from '../utils/navigation';

const MainTab = createBottomTabNavigator<MainTabParamList, 'MainTab'>();

const MainTabNavigator = () => {
	const { theme } = useTheme();

	return (
		<MainTab.Navigator
			id='MainTab'
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color }) => (
					<Icon name={getIcon(route.name)} color={color} size={28} />
				),
				tabBarActiveTintColor: theme.icon.default.color,
				tabBarInactiveTintColor: 'gray',
				tabBarShowLabel: false,
				headerShown: false
			})}
			initialRouteName='Home'
		>
			<MainTab.Screen name='Home' component={HomeStackNavigator} />
			<MainTab.Screen name='Orders' component={OrdersStackNavigator} />
			<MainTab.Screen name='Products' component={ProductsStackNavigator} />
			<MainTab.Screen name='Store' component={StoreStackNavigator} />
		</MainTab.Navigator>
	);
};

export default MainTabNavigator;
