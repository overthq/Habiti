import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import Section from '../components/product/Section';
import Images from '../components/product/Images';
import { formatNaira } from '../utils/currency';
import useGoBack from '../hooks/useGoBack';

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
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{product.name}</Text>
			</View>
			<Images productId={productId} images={product.images} />
			<Section title='Name' content={product.name} />
			<Section title='Description' content={product.description} />
			<Section title='Unit Price' content={formatNaira(product.unitPrice)} />
			<Section title='Quantity in stock' content={`${product.quantity}`} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 8,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default Product;
