import { formatNaira } from '@habiti/common';
import { Spacer, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useProductContext } from './ProductContext';

const ProductDetails: React.FC = () => {
	const { product } = useProductContext();

	return (
		<View style={styles.container}>
			<Typography size='xxlarge' weight='bold'>
				{product.name}
			</Typography>
			<Spacer y={2} />
			<Typography size='xlarge' weight='medium' variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
			<Spacer y={12} />
			<Typography variant='label' weight='medium'>
				Description
			</Typography>
			<Spacer y={4} />
			<Typography>{product?.description}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	}
});

export default ProductDetails;
