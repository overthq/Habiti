import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useItemQuery } from '../types/api';
import { Icon } from '../components/icons';
import { upsertItemToCart, removeItemFromCart } from '../redux/carts/actions';

interface CartItemProps {
	itemId: string;
	quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ itemId, quantity }) => {
	const dispatch = useDispatch();
	const [{ data }] = useItemQuery({ variables: { itemId } });

	const item = data?.items[0];

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={styles.imagePlaceholder} />
				<View>
					<Text style={{ fontSize: 16 }}>{item?.name}</Text>
					<Text style={{ fontSize: 14, marginTop: 8 }}>{item?.unit_price}</Text>
				</View>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity
					style={{ marginRight: 7.5 }}
					onPress={() => {
						dispatch(
							upsertItemToCart({
								storeId: item?.store_id,
								itemId,
								quantity: quantity - 1
							})
						);
					}}
				>
					<Icon name='minus' color='#828282' />
				</TouchableOpacity>
				<Text style={{ fontSize: 16, fontVariant: ['tabular-nums'] }}>
					{quantity}
				</Text>
				<TouchableOpacity
					style={{ marginLeft: 7.5 }}
					onPress={() => {
						dispatch(
							upsertItemToCart({
								storeId: item?.store_id,
								itemId,
								quantity: quantity + 1
							})
						);
					}}
				>
					<Icon name='plus' color='#828282' />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginLeft: 7.5 }}
					onPress={() => {
						dispatch(removeItemFromCart({ storeId: item?.store_id, itemId }));
					}}
				>
					<Icon name='trash' color='#828282' />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 5
	},
	imagePlaceholder: {
		height: 50,
		width: 50,
		marginRight: 10,
		borderRadius: 8,
		backgroundColor: '#D3D3D3'
	}
});

export default CartItem;
