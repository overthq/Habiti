import { Screen } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import FAB from '../components/products/FAB';
import HeaderActions from '../components/products/HeaderActions';
import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';
import { AppStackParamList } from '../types/navigation';

const Products: React.FC = () => {
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({ title: 'Products', headerRight: HeaderActions });
	}, []);

	return (
		<Screen>
			<ProductsFilter />
			<View style={{ flex: 1 }}>
				<ProductList />
			</View>
			<FAB onPress={() => navigate('Add Product')} text='Add Product' />
		</Screen>
	);
};

export default Products;
