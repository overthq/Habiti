import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductOptions = () => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Options
			</Typography>
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
