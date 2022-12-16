import React from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import ProductMain from '../components/product/ProductMain';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Product'>>();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	useGoBack();

	if (fetching || !data?.product) {
		return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
	}

	return <ProductMain product={data.product} />;
};

export default Product;
