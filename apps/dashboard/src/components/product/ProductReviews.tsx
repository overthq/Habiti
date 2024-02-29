import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductReviews = () => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Reviews
			</Typography>
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
