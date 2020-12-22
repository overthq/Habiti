import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
// import { useItemQuery } from '../types/api';
import { Icon } from '../components/icons';
import { CartsContext } from '../contexts/CartsContext';
import { AppStackParamList } from '../types/navigation';
import { items } from '../api';

const Item = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Item'>>();
	const { addItemToCart } = React.useContext(CartsContext);
	// const [{ data }] = useItemQuery({
	// 	variables: { itemId: params.itemId }
	// });
	const [quantity, setQuantity] = React.useState(0);

	const item = items.find(item => item.id === params.itemId);

	if (!item) throw new Error('Item does  not exist');

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imagePlaceholder}>
				<Image
					source={{ uri: item.imageUrl }}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
				<Text style={{ fontWeight: '500' }}>{item.name}</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 5
					}}
				>
					<Text style={{ fontWeight: 'bold', fontSize: 22 }}>{item.name}</Text>
					<Text style={{ fontSize: 18 }}>${item.price}</Text>
				</View>
				<View
					style={{
						width: '100%',
						height: 1,
						backgroundColor: '#D3D3D3',
						marginVertical: 10
					}}
				/>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginVertical: 10
					}}
				>
					<Text style={{ fontSize: 16, fontWeight: '500' }}>Quantity</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity
							style={{ marginRight: 7.5 }}
							onPress={() => {
								if (quantity !== 0) setQuantity(quantity - 1);
							}}
						>
							<Icon name='minus' color='#828282' />
						</TouchableOpacity>
						<Text style={{ fontSize: 16, fontVariant: ['tabular-nums'] }}>
							{quantity}
						</Text>
						<TouchableOpacity
							style={{ marginLeft: 7.5 }}
							onPress={() => setQuantity(quantity + 1)}
						>
							<Icon name='plus' color='#828282' />
						</TouchableOpacity>
					</View>
				</View>
				<TouchableOpacity
					style={styles.cartButton}
					onPress={() => {
						if (item.storeId) {
							addItemToCart({
								storeId: item.storeId,
								itemId: item.id,
								quantity
							});
						}
					}}
				>
					<View style={{ marginRight: 5 }}>
						<Icon size={22} color='#FFFFFF' name='plus' />
					</View>
					<Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
						Add to Cart
					</Text>
				</TouchableOpacity>
				<Text
					style={{
						marginVertical: 10,
						textTransform: 'uppercase',
						color: '#505050',
						fontWeight: '500'
					}}
				>
					Description
				</Text>
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
	cartButton: {
		marginVertical: 10,
		width: '100%',
		height: 40,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#202020'
	}
});

export default Item;
