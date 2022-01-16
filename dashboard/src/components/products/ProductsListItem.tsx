import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductsStackParamList } from '../../types/navigation';
import { Icon } from '../Icon';
import { ProductsQuery } from '../../types/api';

interface ProductsListItemProps {
	product: ProductsQuery['store']['products'][-1];
}

// TODO: Convert this to a grid-item, displaying the product image.
const ProductsListItem: React.FC<ProductsListItemProps> = ({ product }) => {
	const { navigate } =
		useNavigation<StackNavigationProp<ProductsStackParamList>>();

	return (
		<TouchableOpacity
			onPress={() => navigate('Product', { productId: product.id })}
			activeOpacity={0.8}
			style={styles.container}
		>
			<View>
				<Text style={styles.name}>{product.name}</Text>
				<Text style={styles.price}>{product.unitPrice} NGN</Text>
			</View>
			<Icon name='chevron-right' />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 4,
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	name: {
		fontSize: 17,
		marginBottom: 4
	},
	price: {
		fontSize: 16,
		color: '#505050'
	}
});

export default ProductsListItem;
