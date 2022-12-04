import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Store from '../screens/Store';
import EditStore from '../screens/EditStore';

const StoreStack = createStackNavigator();

const StoreStackNavigator = () => {
	return (
		<StoreStack.Navigator>
			<StoreStack.Screen
				name='StoreHome'
				component={Store}
				options={{ headerTitle: 'Store' }}
			/>
			<StoreStack.Screen name='Edit Store' component={EditStore} />
		</StoreStack.Navigator>
	);
};

export default StoreStackNavigator;
