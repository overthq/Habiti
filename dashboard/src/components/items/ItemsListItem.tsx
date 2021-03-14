import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ItemsQuery } from '../../types/api';
import { Icon } from '../icons';

interface ItemsListItemProps {
	item: ItemsQuery['items'][-1];
}

const ItemsListItem: React.FC<ItemsListItemProps> = ({ item }) => {
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			onPress={() => navigate('Item', { itemId: item.id })}
			style={styles.container}
		>
			<View>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>{item.unit_price} NGN</Text>
			</View>
			<Icon name='chevronRight' />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4
	},
	name: {
		fontSize: 18,
		fontWeight: '500',
		color: '#505050',
		marginBottom: 4
	},
	price: {
		fontSize: 16
	}
});

export default ItemsListItem;
