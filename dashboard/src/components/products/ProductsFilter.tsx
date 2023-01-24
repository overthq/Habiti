import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';

const ProductsFilter = () => {
	return (
		<View style={styles.container}>
			<Pressable>
				<Text>All</Text>
			</Pressable>
			<Pressable>
				<Text>Active</Text>
			</Pressable>
			<Pressable>
				<Text>Draft</Text>
			</Pressable>
			<Pressable>
				<Icon name='filter' size={22} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#E3E3E3'
	}
});

export default ProductsFilter;
