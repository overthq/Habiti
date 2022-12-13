import React from 'react';
import { View, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Products from '../screens/Products';
import Product from '../screens/Product';

import { Icon } from '../components/Icon';
import { ProductsStackParamList } from '../types/navigation';
// import SearchProducts from '../components/products/SearchProducts';

const ProductsStack = createStackNavigator<ProductsStackParamList>();

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator>
		<ProductsStack.Screen
			name='ProductsList'
			component={Products}
			options={({ navigation }) => ({
				title: 'Products',
				headerRight: () => (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginRight: 16
						}}
					>
						{/* <Pressable
							onPress={() => navigation.navigate('SearchProducts')}
							style={{ marginRight: 4 }}
						>
							<Icon name='search' />
						</Pressable> */}
						<Pressable onPress={() => navigation.navigate('Add Product')}>
							<Icon name='plus' size={28} />
						</Pressable>
					</View>
				)
			})}
		/>
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
