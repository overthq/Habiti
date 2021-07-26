import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ItemsStackParamList } from '../../types/navigation';
import { Icon } from '../icons';
import { ItemsQuery } from '../../types/api';

interface ItemsListItemProps {
	item: ItemsQuery['items'][-1];
}

// TODO: Convert this to a grid-item, displaying the item image.
const ItemsListItem: React.FC<ItemsListItemProps> = ({ item }) => {
	const { navigate } =
		useNavigation<StackNavigationProp<ItemsStackParamList>>();

	return (
		<TouchableOpacity
			onPress={() => navigate('Item', { itemId: item.id })}
			activeOpacity={0.8}
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

export default ItemsListItem;
