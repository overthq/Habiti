import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Orders from '../screens/Orders';
import Order from '../screens/Order';
import { OrdersStackParamsList } from '../types/navigation';

const OrdersStack = createStackNavigator<OrdersStackParamsList>();

const OrdersStackNavigator = () => (
	<OrdersStack.Navigator>
		<OrdersStack.Screen
			name='OrdersList'
			component={Orders}
			options={{ title: 'Orders' }}
		/>
		<OrdersStack.Screen name='Order' component={Order} />
	</OrdersStack.Navigator>
);

export default OrdersStackNavigator;
