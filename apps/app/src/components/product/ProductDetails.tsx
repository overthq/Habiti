import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
	<View style={styles.container}>
		<View style={styles.meta}>
			<Typography size='xxlarge' weight='medium'>
				{product.name}
			</Typography>
			<Typography size='large'>{formatNaira(product.unitPrice)}</Typography>
		</View>
		<Typography weight='medium' variant='secondary'>
			Description
		</Typography>
		<Typography>{product?.description}</Typography>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 16
	},
	meta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 4
	},
	header: {
		marginVertical: 8,
		textTransform: 'uppercase'
	}
});

export default ProductDetails;
