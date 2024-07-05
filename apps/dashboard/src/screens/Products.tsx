import { Screen } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import HeaderActions from '../components/products/HeaderActions';
import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';

const Products: React.FC = () => {
	const { setOptions } = useNavigation();

	React.useLayoutEffect(() => {
		setOptions({ title: 'Products', headerRight: HeaderActions });
	}, []);

	return (
		<Screen>
			<ProductsFilter />
			<View style={{ flex: 1 }}>
				<ProductList />
			</View>
		</Screen>
	);
};

export default Products;
