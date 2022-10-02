import React from 'react';
import AddProduct from '../screens/AddProduct';
import EditStore from '../screens/EditStore';
import SettingsStackNavigator from './SettingsStack';
import { AppStack } from './AppStack';
import CustomerInfo from '../screens/CustomerInfo';

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
		<AppStack.Screen
			name='Settings'
			options={{ headerShown: false }}
			component={SettingsStackNavigator}
		/>
		<AppStack.Screen name='Edit Store' component={EditStore} />
		<AppStack.Screen
			name='CustomerInfo'
			component={CustomerInfo}
			options={{ headerTitle: 'Customer Information' }}
		/>
	</AppStack.Group>
);

export default ModalGroup;
