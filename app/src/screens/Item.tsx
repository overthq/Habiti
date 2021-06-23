import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useItemQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ImageCarousel from '../components/item/ImageCarousel';
import AddToCart from '../components/item/AddToCart';

const Item = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Item'>>();
	const [{ data }] = useItemQuery({
		variables: { itemId: params.itemId }
	});

	const item = data?.items_by_pk;

	if (!item) throw new Error('How can this be?');

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imagePlaceholder}>
				<ImageCarousel images={item.item_images} />
			</View>
			<View style={styles.detailsContainer}>
				<View style={styles.metaContainer}>
					<Text style={styles.itemName}>{item.name}</Text>
					<Text style={{ fontSize: 18 }}>${item.unit_price}</Text>
				</View>
				<View style={styles.separator} />
				<AddToCart storeId={item.store.id} itemId={item.id} />
				<Text style={styles.descriptionHeader}>Description</Text>
				<Text style={{ fontSize: 16 }}>{item?.description}</Text>
				{/* Related Items */}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	imagePlaceholder: {
		height: 300,
		width: '100%',
		backgroundColor: '#D3D3D3'
	},
	detailsContainer: {
		paddingHorizontal: 20,
		paddingTop: 20
	},
	itemName: {
		fontWeight: 'bold',
		fontSize: 20
	},
	metaContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5
	},
	descriptionHeader: {
		marginVertical: 10,
		textTransform: 'uppercase',
		color: '#505050',
		fontWeight: '500'
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: '#D3D3D3',
		marginVertical: 10
	}
});

export default Item;
