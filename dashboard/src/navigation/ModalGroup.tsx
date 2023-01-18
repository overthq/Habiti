import React from 'react';
import { AppStack } from './AppStack';
import SettingsStackNavigator from './SettingsStack';
import AddProduct from '../screens/AddProduct';
import CustomerInfo from '../screens/CustomerInfo';
import AddPayout from '../screens/AddPayout';

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal' }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
		<AppStack.Screen name='Settings' component={SettingsStackNavigator} />
		<AppStack.Group screenOptions={{ headerShown: true }}>
			<AppStack.Screen
				name='CustomerInfo'
				component={CustomerInfo}
				options={{ headerTitle: 'Customer Information' }}
			/>
			<AppStack.Screen
				name='AddPayout'
				component={AddPayout}
				options={{ headerTitle: 'Add Payout' }}
			/>
		</AppStack.Group>
	</AppStack.Group>
);

export default ModalGroup;
