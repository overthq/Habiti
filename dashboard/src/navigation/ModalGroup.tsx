import React from 'react';
import { AppStack } from './AppStack';
import SettingsStackNavigator from './SettingsStack';
import AddProduct from '../screens/AddProduct';
import CustomerInfo from '../screens/CustomerInfo';
import AddPayout from '../screens/AddPayout';
import AddCategory from '../screens/AddCategory';
import AddManager from '../screens/AddManager';
import FilterProducts from '../screens/FilterProducts';

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal' }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
		<AppStack.Screen
			name='Settings'
			component={SettingsStackNavigator}
			options={{ headerShown: false }}
		/>
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
			name='AddManager'
			component={AddManager}
			options={{ headerTitle: 'Add Manager' }}
		/>
		<AppStack.Screen
			name='FilterProducts'
			component={FilterProducts}
			options={{ headerTitle: 'Filter Products' }}
		/>
	</AppStack.Group>
);

export default ModalGroup;
