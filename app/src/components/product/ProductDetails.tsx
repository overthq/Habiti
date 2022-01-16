import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
	<View style={styles.container}>
		<View style={styles.meta}>
			<Text style={styles.name}>{product.name}</Text>
			<Text style={styles.price}>{formatNaira(product.unitPrice)}</Text>
		</View>
		<Text style={styles.header}>Description</Text>
		<Text style={styles.description}>{product?.description}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 16
	},
	name: {
		fontWeight: 'bold',
		fontSize: 24
	},
	price: {
		fontSize: 18
	},
	meta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: '#D3D3D3'
	},
	header: {
		marginVertical: 8,
		textTransform: 'uppercase',
		color: '#505050',
		fontWeight: '500'
	},
	description: {
		fontSize: 16
	}
});

export default ProductDetails;
