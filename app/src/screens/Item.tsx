import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useItemQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ImageCarousel from '../components/item/ImageCarousel';
import AddToCart from '../components/item/AddToCart';
import ItemDetails from '../components/item/ItemDetails';

const Item = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Item'>>();
	const [{ data }] = useItemQuery({
		variables: { itemId: params.itemId }
	});

	const item = data?.items_by_pk;

	if (!item) throw new Error('How can this be?');

	return (
		<ScrollView style={styles.container}>
			<ImageCarousel images={item.item_images} />
			<ItemDetails item={item} />
			<AddToCart
				storeId={item.store.id}
				itemId={item.id}
				cartId={item.cart_items[0]?.cart_id}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Item;
