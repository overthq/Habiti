import React from 'react';
import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import { WatchlistQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface WatchlistProductProps {
	onPress(): void;
	product: WatchlistQuery['currentUser']['watchlist'][-1]['product'];
}

const WatchlistProduct: React.FC<WatchlistProductProps> = ({
	product,
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={styles.placeholder}>
				<Image source={{ uri: product.images[0]?.path }} style={styles.image} />
			</View>
			<Text style={styles.name} numberOfLines={1}>
				{product.name}
			</Text>
			<Text style={styles.price}>{formatNaira(product.unitPrice)}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		width: 160
	},
	placeholder: {
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		width: 160,
		height: 160,
		marginBottom: 8,
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%'
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
