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
		<AppStack.Screen
			name='CustomerInfo'
			component={CustomerInfo}
			options={{ headerTitle: 'Customer Information', headerShown: true }}
		/>
		<AppStack.Screen
			name='AddPayout'
			component={AddPayout}
			options={{ headerTitle: 'Add Payout', headerShown: true }}
		/>
	</AppStack.Group>
);

export default ModalGroup;
