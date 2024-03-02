import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import ProductMain from '../components/product/ProductMain';
import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Product'>>();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	useGoBack();

	if (fetching || !data?.product) {
		return <View />;
	}

	return <ProductMain mode='edit' product={data.product} />;
};

export default Product;
