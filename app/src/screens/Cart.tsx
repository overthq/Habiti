import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useClient } from 'urql';
import CartItem from '../components/CartItem';
import {
	usePlaceOrderMutation,
	useCreateOrderItemsMutation
} from '../types/api';
import { AppStackParamList } from '../types/navigation';
import { useAppSelector } from '../redux/store';
import { ItemsMoreDetailsDocument, ItemsMoreDetailsQuery } from '../types/api';

// TODO: Switch to server-based carts system.
// Not sure if its the best, but we can always build a better solution if need be.
// Might also come in handy if we decide to build a web-based client.

const Cart: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { userId, carts } = useAppSelector(({ auth, carts }) => ({
		userId: auth.userId,
		carts: carts.carts
	}));
	const [, placeOrder] = usePlaceOrderMutation();
	const [, createOrderItems] = useCreateOrderItemsMutation();
	const client = useClient();
	const { storeId } = params;

	const cart = carts.find(({ storeId: id }) => id === storeId);

	if (!cart) throw new Error('This cart does not exist');

	const prepareCart = async (order_id: string) => {
		const { data, error } = await client
			.query<ItemsMoreDetailsQuery>(ItemsMoreDetailsDocument, {
				itemIds: cart?.items.map(({ itemId }) => itemId)
			})
			.toPromise();

		if (error) console.log(error);
		if (!data) throw new Error('Something went horribly wrong.');

		return cart.items.map(({ itemId, quantity }) => ({
			order_id,
			item_id: itemId,
			quantity,
			unit_price: data.items.find(({ id }) => id === itemId)?.unit_price
		}));
	};

	const handleSubmit = async () => {
		if (userId) {
			const { data } = await placeOrder({
				input: { user_id: userId, store_id: cart?.storeId }
			});

			if (data?.insert_orders?.returning) {
				createOrderItems({
					items: await prepareCart(data.insert_orders.returning[0].id)
				});
			}
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Checkout</Text>
			<Text style={styles.sectionHeader}>Order Summary</Text>
			{cart?.items.map(({ itemId, quantity }) => (
				<CartItem key={itemId} {...{ itemId, quantity }} />
			))}
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.orderButton}
				onPress={handleSubmit}
			>
				<Text style={styles.orderButtonText}>Place Order</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 20
	},
	heading: {
		fontWeight: 'bold',
		fontSize: 32
	},
	orderButton: {
		width: '100%',
		height: 45,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000'
	},
	orderButtonText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF'
	},
	sectionHeader: {
		fontSize: 18,
		fontWeight: '500',
		color: '#505050',
		marginTop: 10
	}
});

export default Cart;
