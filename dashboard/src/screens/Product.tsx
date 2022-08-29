import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import Section from '../components/product/Section';
import Images from '../components/product/Images';

import useGoBack from '../hooks/useGoBack';
import { formatNaira } from '../utils/currency';

import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';

// TODO:
// - Allow editing of inventory
// - Set up "collections/groups" for products
// - We can display this somehow on the store screen for shoppers.
// - Blur the line between the "Product" and "Edit Product" screens.

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});
	useGoBack();

	const product = data?.product;

	if (fetching || !product) return <ActivityIndicator />;

	return (
		<ScrollView style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{product.name}</Text>
			</View>
			<Images productId={productId} images={product.images} />
			<Section title='Name' content={product.name} />
			<Section title='Description' content={product.description} />
			<Section title='Unit Price' content={formatNaira(product.unitPrice)} />
			<Section title='Quantity in stock' content={`${product.quantity}`} />
			{/* TODO: Inventory */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 16,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default Product;
