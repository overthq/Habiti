import { Button, Spacer, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductQuery } from '../../types/api';

interface ProductOptionsProps {
	options?: ProductQuery['product']['options'];
}

const NoProductOptions = () => {
	return (
		<View>
			<Spacer y={8} />
			<Typography>
				There are no product options. Created options appear here.
			</Typography>
			<Spacer y={8} />
			<Button text='Create option' />
		</View>
	);
};

const ProductOptions: React.FC<ProductOptionsProps> = ({ options }) => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Options
			</Typography>
			<View>{options?.length === 0 ? <NoProductOptions /> : <View />}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	title: {}
});

export default ProductOptions;
