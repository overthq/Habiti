import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ProductsFilter = () => {
	return (
		<View style={styles.container}>
			<TextInput
				placeholder='Search your products'
				placeholderTextColor='#777777'
				style={styles.input}
				selectionColor='#000000'
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		width: '100%',
		backgroundColor: '#FFFFFF',
		height: 48,
		paddingBottom: 12,
		marginBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#E3E3E3'
	},
	input: {
		height: '100%',
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		paddingHorizontal: 16,
		fontSize: 16
	}
});

export default ProductsFilter;
