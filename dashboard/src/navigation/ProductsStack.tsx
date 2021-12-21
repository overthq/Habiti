import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Products from '../screens/Products';
import Product from '../screens/Product';

import { Icon } from '../components/icons';
import { ProductsStackParamList } from '../types/navigation';

const ProductsStack = createStackNavigator<ProductsStackParamList>();

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator>
		<ProductsStack.Screen
			name='ProductsList'
			component={Products}
			options={({ navigation }) => ({
				title: 'Products',
				headerRight: () => (
					<TouchableOpacity
						onPress={() => navigation.navigate('Add Product')}
						style={{ marginRight: 16 }}
					>
						<Icon name='plus' />
					</TouchableOpacity>
				)
			})}
		/>
		<ProductsStack.Screen
			name='Product'
			component={Product}
			options={() => ({
				title: '',
				headerBackTitleVisible: false,
				headerBackImage: () => <Icon size={28} name='chevronLeft' />
			})}
		/>
	</ProductsStack.Navigator>
);

export default ProductsStackNavigator;
