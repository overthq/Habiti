import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductList from '../components/products/ProductList';

const Products: React.FC = () => {
	return (
		<View style={styles.container}>
			<ProductList mode='list' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 8,
		backgroundColor: '#FFFFFF'
	}
});

export default Products;
