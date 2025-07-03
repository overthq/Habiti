import React from 'react';

import { AppStack } from './AppStack';
import AddCategory from '../screens/AddCategory';
import AddManager from '../screens/AddManager';
import AddPayout from '../screens/AddPayout';
import AddProduct from '../screens/AddProduct';
import CreateStore from '../screens/CreateStore';
import CustomerInfo from '../screens/CustomerInfo';
import EditCategory from '../screens/EditCategory';

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
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
		<AppStack.Screen
			name='AddCategory'
			component={AddCategory}
			options={{ headerTitle: 'Add Category' }}
		/>
		<AppStack.Screen
			name='Modals.EditCategory'
			component={EditCategory}
			options={{ headerTitle: 'Edit Category' }}
		/>
		<AppStack.Screen
			name='AddManager'
			component={AddManager}
			options={{ headerTitle: 'Add Manager' }}
		/>
		<AppStack.Screen
			name='Modal.CreateStore'
			component={CreateStore}
			options={{ headerTitle: 'Create Store' }}
		/>
	</AppStack.Group>
);

export default ModalGroup;
