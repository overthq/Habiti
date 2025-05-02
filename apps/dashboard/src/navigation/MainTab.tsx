import { useTheme, Icon, themes } from '@habiti/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import HomeStackNavigator from './HomeStack';
import OrdersStackNavigator from './OrdersStack';
import ProductsStackNavigator from './ProductsStack';
import StoreStackNavigator from './StoreStack';
import { MainTabParamList } from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

const MainTab = createBottomTabNavigator<MainTabParamList, 'MainTab'>();

const MainTabNavigator = () => {
	const { name } = useTheme();

	return (
		<MainTab.Navigator
			id='MainTab'
			screenOptions={tabScreenOptions(name)}
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
