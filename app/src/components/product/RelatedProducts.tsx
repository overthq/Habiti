import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RelatedProducts = () => {
	return (
		<View style={styles.container}>
			<Text>Related products</Text>
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
