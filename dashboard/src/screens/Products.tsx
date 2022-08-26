import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductList from '../components/products/ProductList';

const Products: React.FC = () => {
	return (
		<View style={styles.container}>
			<ProductList mode='grid' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingTop: 16
	}
});

export default Products;
