import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ItemsQuery } from '../../types/api';

interface WatchlistItemProps {
	item: ItemsQuery['items'][-1];
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			style={styles.itemContainer}
			onPress={() => navigate('Item', { itemId: item.id })}
			activeOpacity={0.8}
		>
			<View style={styles.imagePlaceholder}>
				<Image
					source={{ uri: '' /* Do something here */ }}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<Text style={styles.itemName} numberOfLines={1}>
				{item.name}
			</Text>
			<Text style={styles.itemPrice}>N{item.unit_price}</Text>
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

export default WatchlistItem;
