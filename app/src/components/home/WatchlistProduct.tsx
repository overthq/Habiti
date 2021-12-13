import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
// import { ItemsQuery } from '../../types/api';

interface WatchlistProductProps {
	product: any; // ItemsQuery['items'][-1];
}

const WatchlistProduct: React.FC<WatchlistProductProps> = ({ product }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<TouchableOpacity
			style={styles.itemContainer}
			onPress={() => navigate('Product', { productId: product.id })}
			activeOpacity={0.8}
		>
			<View style={styles.imagePlaceholder}>
				<Image
					source={{ uri: '' /* Do something here */ }}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<Text style={styles.itemName} numberOfLines={1}>
				{product.name}
			</Text>
			<Text style={styles.itemPrice}>N{product.unitPrice}</Text>
			<Text style={styles.itemStatus}>In Stock</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		marginLeft: 16,
		width: 160
	},
	imagePlaceholder: {
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		width: 160,
		height: 160,
		marginBottom: 8,
		overflow: 'hidden'
	},
	itemName: {
		fontSize: 16,
		fontWeight: '500'
	},
	itemPrice: {
		fontSize: 16,
		color: '#505050'
	},
	itemStatus: {
		fontSize: 14,
		color: '#7dba03',
		fontWeight: '500'
	}
});

export default WatchlistProduct;
