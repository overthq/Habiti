import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useItemQuery } from '../types/api';
import { ItemsStackParamList } from '../types/navigation';
import Section from '../components/item/Section';
import Images from '../components/item/Images';

const Item: React.FC = () => {
	const {
		params: { itemId }
	} = useRoute<RouteProp<ItemsStackParamList, 'Item'>>();
	const [{ data, fetching }] = useItemQuery({ variables: { itemId } });

	const item = data?.items_by_pk;

	if (fetching) return <ActivityIndicator />;
	if (!item) throw new Error('This item does not exist');

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{item.name}</Text>
			</View>
			<Images itemId={itemId} images={item.item_images} />
			<Section title='Name' content={item.name} />
			<Section title='Description' content={item.description} />
			<Section title='Unit Price' content={`${item.unit_price} NGN`} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 8,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default Item;
