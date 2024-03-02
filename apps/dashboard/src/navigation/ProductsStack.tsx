import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Product from '../screens/Product';
import Products from '../screens/Products';
import { ProductsStackParamList } from '../types/navigation';
// import SearchProducts from '../components/products/SearchProducts';

const ProductsStack = createStackNavigator<ProductsStackParamList>();

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator initialRouteName='ProductsList'>
		<ProductsStack.Screen name='ProductsList' component={Products} />
		<ProductsStack.Screen
			name='Product'
			component={Product}
			options={{ title: '' }}
		/>
		{/* <ProductsStack.Screen
			name='SearchProducts'
			component={SearchProducts}
			options={{
				cardStyleInterpolator: ({ current }) => ({ opacity: current.progress })
			}}
		/> */}
	</ProductsStack.Navigator>
);

export default ProductsStackNavigator;
