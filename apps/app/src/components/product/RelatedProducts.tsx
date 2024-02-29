import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const RelatedProducts = () => {
	return (
		<View style={styles.container}>
			<Typography>Related products</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16
	}
});

export default RelatedProducts;
