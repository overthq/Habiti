import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ItemsQuery } from '../../types/api';

interface ItemsListItemProps {
	item: ItemsQuery['items'][-1];
}

const ItemsListItem: React.FC<ItemsListItemProps> = ({ item }) => {
	return (
		<View style={styles.container}>
			<Text>{item.name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%'
	}
});

export default ItemsListItem;
