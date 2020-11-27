import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useItemQuery } from '../types/api';
import { Icon } from '../components/icons';
import { CartsContext } from '../contexts/CartsContext';

interface CartItemProps {
	itemId: string;
	quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ itemId, quantity }) => {
	const [{ data }] = useItemQuery({ variables: { itemId } });
	const { addItemToCart, removeItemFromCart } = React.useContext(CartsContext);

	const item = data?.items[0];

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={styles.imagePlaceholder} />
				<Text style={{ fontSize: 16 }}>{item?.name}</Text>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity
					style={{ marginRight: 7.5 }}
					onPress={() => {
						if (quantity !== 0) {
							if (item?.store_id) {
								addItemToCart({
									storeId: item.store_id,
									itemId,
									quantity: quantity - 1
								});
							}
						}
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
						if (item?.store_id) {
							addItemToCart({
								storeId: item.store_id,
								itemId,
								quantity: quantity + 1
							});
						}
					}}
				>
					<Icon name='plus' color='#828282' />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginLeft: 7.5 }}
					onPress={() => {
						if (item?.store_id) {
							removeItemFromCart(item.store_id, itemId);
						}
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
