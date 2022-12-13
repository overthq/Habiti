import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ProductsFilter = () => {
	return (
		<View style={styles.container}>
			<TextInput style={styles.input} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		width: '100%',
		backgroundColor: '#FFFFFF',
		height: 40,
		paddingVertical: 4
	},
	input: {
		height: '100%',
		borderRadius: 4,
		backgroundColor: '#D3D3D3',
		paddingHorizontal: 8
	}
});

export default ProductsFilter;
