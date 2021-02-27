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

	// Function: Get the unit_price for each of the items, and use it in the order generation.
	// It's very sad to be running these queries on the frontend, though.
	// Might have to create "yet another microservice" to handle orders (especially things like this).
	//
	// NOTE: The reason we add the unit_price field to the order_item itself, is to make sure that future price changes don't affect past orders and invoices.
	// That said, there has to be a better way to handle this, without creating the entire order and everything on this end of the code. It's incredibly unsafe and tacky.
	//
	// UPDATE: Apparently, I'm doing this wrong.
	// The carts should be saved on the server, instead of on the client.
	// The only issue I have with that is, what if the unit prices change between the time the user creates the cart, and the time the user places the order?
	// This system design issue is beyond my front-end pay grade.
	//
	// Steps to fix this problem (and solidify the order-creation process on this app):
	// - Clearly mark the order creation point.
	//

	const prepareCart = async (order_id: string) => {
		const { data } = await client
			.query<ItemsMoreDetailsQuery>(ItemsMoreDetailsDocument, {
				itemIds: cart?.items.map(({ itemId }) => itemId)
			})
			.toPromise();

		return (
			cart?.items.map(({ itemId, quantity }) => ({
				order_id,
				item_id: itemId,
				quantity,
				unit_price: data?.items.find(({ id }) => id === itemId)?.unit_price
			})) ?? []
		);
	};

	const handleSubmit = async () => {
		if (userId) {
			const { data: orderData } = await placeOrder({
				input: { user_id: userId, store_id: cart?.storeId }
			});

			if (orderData?.insert_orders?.returning) {
				createOrderItems({
					items: await prepareCart(orderData.insert_orders.returning[0].id)
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
