import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Product from '../screens/Product';
import Products from '../screens/Products';
import SearchProducts from '../screens/SearchProducts';
import { ProductsStackParamList } from '../types/navigation';

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator initialRouteName='ProductsList'>
		<ProductsStack.Screen
			name='ProductsList'
			component={Products}
			options={{ headerShown: false }}
		/>
		<ProductsStack.Screen
			name='Product'
			component={Product}
			options={{ title: '' }}
		/>
		<ProductsStack.Screen
			name='Products.Search'
			component={SearchProducts}
			options={{ headerShown: false }}
		/>
	</ProductsStack.Navigator>
);

export default ProductsStackNavigator;
