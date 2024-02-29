import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';

import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductGridItemProps {
	product: ProductsQuery['currentStore']['products'][number];
	onPress(): void;
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({
	product,
	onPress
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<View style={styles.placeholder}>
			<Image style={styles.image} source={{ uri: product.images[0]?.path }} />
		</View>
		<Text style={styles.name}>{product.name}</Text>
		<Text style={styles.price}>{formatNaira(product.unitPrice)}</Text>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 8,
		paddingTop: 8
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		height: 200,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		marginTop: 4
	},
	price: {
		fontSize: 16,
		color: '#777777'
	}
});

export default ProductGridItem;
