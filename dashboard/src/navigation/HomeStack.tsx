import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Overview from '../screens/Overview';
import Payouts from '../screens/Payouts';
import Order from '../screens/Order';
import Product from '../screens/Product';

import { HomeStackParamList } from '../types/navigation';

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name='Overview' component={Overview} />
			<HomeStack.Screen name='Payouts' component={Payouts} />
			<HomeStack.Screen name='Order' component={Order} />
			<HomeStack.Screen name='Product' component={Product} />
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
