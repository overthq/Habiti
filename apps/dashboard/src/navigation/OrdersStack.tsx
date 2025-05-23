import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Order from '../screens/Order';
import Orders from '../screens/Orders';
import { OrdersStackParamList } from '../types/navigation';
import ProductStackNavigator from './ProductStack';

const OrdersStack = createNativeStackNavigator<
	OrdersStackParamList,
	'OrdersStack'
>();

const OrdersStackNavigator = () => (
	<OrdersStack.Navigator id='OrdersStack' initialRouteName='OrdersList'>
		<OrdersStack.Screen
			name='OrdersList'
			component={Orders}
			options={{ headerShown: false }}
		/>
		<OrdersStack.Screen name='Order' component={Order} />
		<OrdersStack.Screen
			name='Product'
			component={ProductStackNavigator}
			options={{ headerShown: false }}
		/>
	</OrdersStack.Navigator>
);

export default OrdersStackNavigator;
