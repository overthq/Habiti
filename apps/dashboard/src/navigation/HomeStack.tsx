import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Order from '../screens/Order';
import Overview from '../screens/Overview';
import Payouts from '../screens/Payouts';
import Product from '../screens/Product';
import { HomeStackParamList } from '../types/navigation';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator initialRouteName='Overview'>
			<HomeStack.Screen
				name='Overview'
				component={Overview}
				options={{ headerShown: false }}
			/>
			<HomeStack.Screen name='Payouts' component={Payouts} />
			<HomeStack.Screen name='Order' component={Order} />
			<HomeStack.Screen name='Product' component={Product} />
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
