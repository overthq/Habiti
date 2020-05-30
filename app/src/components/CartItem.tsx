import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useItemQuery } from '../types';
import { Icon } from '../components/icons';
import { CartsContext } from '../contexts/CartsContext';

const CartItem: React.FC<{ itemId: string; quantity: number }> = ({
	itemId,
	quantity
}) => {
	const [{ data }] = useItemQuery({ variables: { itemId } });
	const { addItemToCart, removeItemFromCart } = React.useContext(CartsContext);

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginVertical: 5
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View
					style={{
						height: 50,
						width: 50,
						marginRight: 10,
						borderRadius: 8,
						backgroundColor: '#D3D3D3'
					}}
				/>
				<Text style={{ fontSize: 16 }}>{data?.item.name}</Text>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity
					style={{ marginRight: 7.5 }}
					onPress={() => {
						if (quantity !== 0) {
							if (data?.item.store_id) {
								addItemToCart({
									storeId: data.item.store_id,
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
						if (data?.item.store_id) {
							addItemToCart({
								storeId: data.item.store_id,
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
						if (data?.item.store_id) {
							removeItemFromCart(data.item.store_id, itemId);
						}
					}}
				>
					<Icon name='trash' color='#828282' />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default CartItem;
