import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useClient } from 'urql';
import CartItem from '../components/CartItem';
import {
	usePlaceOrderMutation,
	useCreateOrderItemsMutation,
	useCartQuery
} from '../types/api';
import { AppStackParamList } from '../types/navigation';
import { useAppSelector } from '../redux/store';
import { ItemsMoreDetailsDocument, ItemsMoreDetailsQuery } from '../types/api';

const Cart: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [, placeOrder] = usePlaceOrderMutation();
	const [, createOrderItems] = useCreateOrderItemsMutation();
	const client = useClient();
	const { cartId } = params;

	const [{ data }] = useCartQuery({ variables: { cartId } });
	const cart = data?.carts_by_pk;

	if (!cart) throw new Error('This cart does not exist');

	const prepareCart = async (order_id: string) => {
		const { data, error } = await client
			.query<ItemsMoreDetailsQuery>(ItemsMoreDetailsDocument, {
				itemIds: cart.cart_items.map(({ item_id }) => item_id)
			})
			.toPromise();

		if (error) console.log(error);
		if (!data) throw new Error('Something went horribly wrong.');

		return cart.cart_items.map(({ item_id, item, quantity }) => ({
			order_id,
			item_id,
			quantity,
			unit_price: item.unit_price
		}));
	};

	const handleSubmit = async () => {
		if (userId) {
			const { data } = await placeOrder({
				input: { user_id: userId, store_id: cart.store_id }
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
			{cart.cart_items.map(({ id, item, quantity }) => (
				<CartItem key={id} {...{ item, quantity }} />
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
