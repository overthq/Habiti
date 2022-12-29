import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Overview from '../screens/Overview';
import Payouts from '../screens/Payouts';
import { HomeStackParamList } from '../types/navigation';

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name='Overview' component={Overview} />
			<HomeStack.Screen name='Payouts' component={Payouts} />
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
