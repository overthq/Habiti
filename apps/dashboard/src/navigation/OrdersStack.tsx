import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Orders from '../screens/Orders';
import Order from '../screens/Order';
import Product from '../screens/Product';
import { OrdersStackParamList } from '../types/navigation';

const OrdersStack = createStackNavigator<OrdersStackParamList>();

const OrdersStackNavigator = () => (
	<OrdersStack.Navigator initialRouteName='OrdersList'>
		<OrdersStack.Screen
			name='OrdersList'
			component={Orders}
			options={{ title: 'Orders' }}
		/>
		<OrdersStack.Screen name='Order' component={Order} />
		<OrdersStack.Screen name='Product' component={Product} />
	</OrdersStack.Navigator>
);

export default OrdersStackNavigator;
