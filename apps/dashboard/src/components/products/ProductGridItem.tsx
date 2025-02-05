import { formatNaira } from '@habiti/common';
import { Typography } from '@habiti/components';
import React from 'react';
import { Pressable, View, Image, StyleSheet } from 'react-native';

import { ProductsQuery } from '../../types/api';

interface ProductGridItemProps {
	product: ProductsQuery['currentStore']['products']['edges'][number]['node'];
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
		<Typography style={styles.name}>{product.name}</Typography>
		<Typography variant='secondary'>
			{formatNaira(product.unitPrice)}
		</Typography>
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
		marginTop: 4
	},
	price: {
		color: '#777777'
	}
});

export default ProductGridItem;
