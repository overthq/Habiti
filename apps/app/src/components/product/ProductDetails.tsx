import { Spacer, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
	<View style={styles.container}>
		<Typography size='xxlarge' weight='bold'>
			{product.name}
		</Typography>
		<Spacer y={2} />
		<Typography size='xlarge' weight='medium' variant='secondary'>
			{formatNaira(product.unitPrice)}
		</Typography>
		<Spacer y={8} />
		<Typography weight='medium' variant='secondary'>
			Description
		</Typography>
		<Spacer y={2} />
		<Typography>{product?.description}</Typography>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 16
	},
	header: {
		marginVertical: 8,
		textTransform: 'uppercase'
	}
});

export default ProductDetails;
