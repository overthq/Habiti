import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StoreProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface StoreListItemProps {
	item: StoreProductsQuery['store']['products'][-1];
	onPress(): void;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item, onPress }) => {
	return (
		<TouchableOpacity
			key={item.id}
			style={styles.pressable}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<View style={styles.placeholder}>
				{item.images[0] && (
					<Image style={styles.image} source={{ uri: item.images[0].path }} />
				)}
			</View>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.price}>{formatNaira(item.unitPrice)}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	pressable: {
		flex: 1 / 2,
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
