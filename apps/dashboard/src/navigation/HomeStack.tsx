import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Order from '../screens/Order';
import Overview from '../screens/Overview';
import Payouts from '../screens/Payouts';

import { HomeStackParamList } from '../types/navigation';
import ProductStackNavigator from './ProductStack';

const HomeStack = createNativeStackNavigator<HomeStackParamList, 'HomeStack'>();

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator initialRouteName='Overview' id='HomeStack'>
			<HomeStack.Screen
				name='Overview'
				component={Overview}
				options={{ headerShown: false }}
			/>
			<HomeStack.Screen name='Payouts' component={Payouts} />
			<HomeStack.Screen name='Order' component={Order} />
			<HomeStack.Screen
				name='Product'
				component={ProductStackNavigator}
				options={{ headerShown: false }}
			/>
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
