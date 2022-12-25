import React from 'react';
import AddProduct from '../screens/AddProduct';
import SettingsStackNavigator from './SettingsStack';
import { AppStack } from './AppStack';
import CustomerInfo from '../screens/CustomerInfo';

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal' }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
		<AppStack.Screen name='Settings' component={SettingsStackNavigator} />
		<AppStack.Screen
			name='CustomerInfo'
			component={CustomerInfo}
			options={{ headerTitle: 'Customer Information', headerShown: true }}
		/>
	</AppStack.Group>
);

export default ModalGroup;
