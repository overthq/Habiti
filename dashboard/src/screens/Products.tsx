import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';

const Products: React.FC = () => {
	return (
		<View style={styles.container}>
			<ProductsFilter />
			<View style={{ flex: 1 }}>
				<ProductList mode='list' />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

export default Products;
