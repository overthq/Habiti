import React from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import ProductMain from '../components/product/ProductMain';
import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { ProductStackParamList } from '../types/navigation';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product'>>();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	useGoBack();

	if (fetching || !data?.product) {
		return <View />;
	}

	return <ProductMain product={data.product} />;
};

export default Product;
