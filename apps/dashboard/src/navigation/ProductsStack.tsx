import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Product from '../screens/Product';
import Products from '../screens/Products';
import SearchProducts from '../screens/SearchProducts';
import { ProductsStackParamList } from '../types/navigation';
import ProductStackNavigator from './ProductStack';

const ProductsStack = createNativeStackNavigator<
	ProductsStackParamList,
	'ProductsStack'
>();

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator id='ProductsStack' initialRouteName='ProductsList'>
		<ProductsStack.Screen
			name='ProductsList'
			component={Products}
			options={{ headerShown: false }}
		/>
		<ProductsStack.Screen
			name='Product'
			component={ProductStackNavigator}
			options={{ headerShown: false }}
		/>
		<ProductsStack.Screen
			name='Products.Search'
			component={SearchProducts}
			options={{ headerShown: false }}
		/>
	</ProductsStack.Navigator>
);

export default ProductsStackNavigator;
