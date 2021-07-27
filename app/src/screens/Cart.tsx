import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import Button from '../components/global/Button';

const Cart: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [, placeOrder] = usePlaceOrderMutation();
	const [, createOrderItems] = useCreateOrderItemsMutation();
	const client = useClient();
	const { cartId } = params;

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });
	const cart = data?.carts_by_pk;

	if (fetching) return <View />;
	if (!cart) return <View />;

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
		<SafeAreaView style={styles.container}>
			<Text style={styles.heading}>Checkout</Text>
			<Text style={styles.sectionHeader}>Order Summary</Text>
			{cart.cart_items.map(({ id, item, quantity }) => (
				<CartItem key={id} {...{ item, quantity }} />
			))}
			<Button text='Place Order' onPress={handleSubmit} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	heading: {
		fontWeight: 'bold',
		fontSize: 32
	},
	sectionHeader: {
		fontSize: 17,
		fontWeight: '500',
		color: '#505050',
		marginVertical: 4
	}
});

export default Cart;
