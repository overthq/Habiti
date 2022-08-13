import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import { StoreProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface StoreListItemProps {
	item: StoreProductsQuery['store']['products'][number];
	onPress(): void;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item, onPress }) => (
	<Pressable key={item.id} style={styles.pressable} onPress={onPress}>
		<View style={styles.placeholder}>
			<Image style={styles.image} source={{ uri: item.images[0]?.path }} />
		</View>
		<Text style={styles.name}>{item.name}</Text>
		<Text style={styles.price}>{formatNaira(item.unitPrice)}</Text>
	</Pressable>
);

const styles = StyleSheet.create({
	pressable: {
		flex: 1,
		margin: 8
	},
	placeholder: {
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		height: 200,
		width: '100%',
		marginBottom: 4,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		marginBottom: 2,
		fontWeight: '500'
	},
	price: {
		color: '#505050',
		fontSize: 15
	}
});

export default StoreListItem;
