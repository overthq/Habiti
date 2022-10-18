import React from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import ProductMain from '../components/product/ProductMain';

// TODO:
// - Set up "collections/groups" for products.
// - We can display this somehow on the store screen for shoppers.

// We need to have a detailed way of knowing if the values have changed from the default,
// for any of the many items on the list here.
// This might be very wasteful w.r.t. render computations, since we'd ideally
// have to check this on every re-render that relates to value changes.

// Create a pattern where we have a wrapper for every screen that depends
// on pre-existing data.
// Basically, the screen displays a loading indicator or error boundary
// if any of the dependencies are not correctly loaded.
// And the actual screen is completely typesafe. (Win-win).
// Also, this is what HOCs were good for.

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
