import { Spacer, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const NoProductReviews = () => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6,
				marginVertical: 8
			}}
		>
			<Typography weight='medium' size='large'>
				No reviews yet
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				This product has not received any reviews yet. When users post reviews
				for this product, they will appear here.
			</Typography>
		</View>
	);
};

const ProductReviews = () => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Reviews
			</Typography>
			<NoProductReviews />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	}
});

export default ProductReviews;
