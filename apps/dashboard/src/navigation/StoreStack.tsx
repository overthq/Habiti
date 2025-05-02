import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Appearance from '../screens/Appearance';
import Categories from '../screens/Categories';
import EditStore from '../screens/EditStore';
import Managers from '../screens/Managers';
import Store from '../screens/Store';
import StorePayouts from '../screens/StorePayouts';
import StoreSettings from '../screens/StoreSettings';
import { StoreStackParamList } from '../types/navigation';

const StoreStack = createNativeStackNavigator<
	StoreStackParamList,
	'StoreStack'
>();

const StoreStackNavigator = () => {
	return (
		<StoreStack.Navigator id='StoreStack' initialRouteName='StoreHome'>
			<StoreStack.Screen
				name='StoreHome'
				component={Store}
				options={{ headerShown: false }}
			/>
			<StoreStack.Screen name='Edit Store' component={EditStore} />
			<StoreStack.Screen name='Managers' component={Managers} />
			<StoreStack.Screen name='Payouts' component={StorePayouts} />
			<StoreStack.Screen name='Categories' component={Categories} />
			<StoreStack.Screen name='Settings' component={StoreSettings} />
			<StoreStack.Screen name='Appearance' component={Appearance} />
		</StoreStack.Navigator>
	);
};

export default StoreStackNavigator;
