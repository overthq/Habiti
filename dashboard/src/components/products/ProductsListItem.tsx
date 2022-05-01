import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductsStackParamList } from '../../types/navigation';
import { Icon } from '../Icon';
import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductsListItemProps {
	product: ProductsQuery['store']['products'][-1];
}

const ProductsListItem: React.FC<ProductsListItemProps> = ({ product }) => {
	const { navigate } =
		useNavigation<StackNavigationProp<ProductsStackParamList>>();

	return (
		<TouchableOpacity
			onPress={() => navigate('Product', { productId: product.id })}
			activeOpacity={0.8}
			style={styles.container}
		>
			<View style={styles.left}>
				<View style={styles.placeholder}>
					{product.images[0] && (
						<Image
							style={styles.image}
							source={{ uri: product.images[0].path }}
						/>
					)}
				</View>
				<View>
					<Text style={styles.name}>{product.name}</Text>
					<Text style={styles.price}>{formatNaira(product.unitPrice)}</Text>
				</View>
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
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	name: {
		fontSize: 17,
		fontWeight: '500',
		marginBottom: 4
	},
	price: {
		fontSize: 16,
		color: '#505050'
	},
	left: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	placeholder: {
		overflow: 'hidden',
		height: 50,
		width: 50,
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		marginRight: 8
	},
	image: {
		height: '100%',
		width: '100%'
	}
});

export default ProductsListItem;
