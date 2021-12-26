import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { WatchlistQuery } from '../../types/api';

interface WatchlistProductProps {
	product: WatchlistQuery['currentUser']['watchlist'][-1]['product'];
}

const WatchlistProduct: React.FC<WatchlistProductProps> = ({ product }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() =>
				navigate('Product', {
					productId: product.id,
					storeId: product.store.id
				})
			}
			activeOpacity={0.8}
		>
			<View style={styles.imagePlaceholder}>
				{product.images[0] && (
					<Image
						source={{ uri: product.images[0].path }}
						style={{ width: '100%', height: '100%' }}
					/>
				)}
			</View>
			<Text style={styles.name} numberOfLines={1}>
				{product.name}
			</Text>
			<Text style={styles.price}>N{product.unitPrice}</Text>
			<Text style={styles.status}>In Stock</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
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
	name: {
		fontSize: 16,
		fontWeight: '500'
	},
	price: {
		fontSize: 16,
		color: '#505050'
	},
	status: {
		fontSize: 14,
		color: '#7dba03',
		fontWeight: '500'
	}
});

export default WatchlistProduct;
