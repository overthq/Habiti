import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useItemQuery } from '../types/api';
import { Icon } from '../components/icons';
import { AppStackParamList } from '../types/navigation';
import { upsertItemToCart } from '../redux/carts/actions';
import QuantityControl from '../components/item/QuantityControl';
import ImageCarousel from '../components/item/ImageCarousel';

const Item = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Item'>>();
	const dispatch = useDispatch();
	const [{ data }] = useItemQuery({
		variables: { itemId: params.itemId }
	});
	const [quantity, setQuantity] = React.useState(0);

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
				<QuantityControl itemId={params.itemId} />
				<TouchableOpacity
					style={styles.cartButton}
					onPress={() => {
						dispatch(
							upsertItemToCart({
								storeId: item.store.id,
								itemId: item.id,
								quantity
							})
						);
					}}
				>
					<Icon
						size={22}
						color='#FFFFFF'
						name='plus'
						style={{ marginRight: 5 }}
					/>
					<Text style={styles.buttonText}>Add to Cart</Text>
				</TouchableOpacity>
				<Text style={styles.descriptionHeader}>Description</Text>
				<Text style={{ fontSize: 16 }}>{item?.description}</Text>
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
	cartButton: {
		marginVertical: 10,
		width: '100%',
		height: 40,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#202020'
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
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#FFFFFF'
	}
});

export default Item;
