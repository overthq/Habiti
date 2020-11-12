import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { CartsContext } from '../contexts/CartsContext';
import CartItem from '../components/CartItem';
import {
	usePlaceOrderMutation,
	useCurrentUserQuery,
	useCreateOrderItemsMutation
} from '../types';
import { AppStackParamList } from '../types/navigation';

const Cart = () => {
	const { navigate } = useNavigation();
	const { params } = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { carts } = React.useContext(CartsContext);
	const [{ data }] = useCurrentUserQuery();
	const [, placeOrder] = usePlaceOrderMutation();
	const [, createOrderItems] = useCreateOrderItemsMutation();
	const { storeId } = params;

	const cart = carts.find(({ storeId: id }) => id === storeId);

	const prepareCart = (order_id: string) =>
		cart?.items.map(({ itemId, quantity }) => ({
			order_id,
			item_id: itemId,
			quantity
		})) ?? [];

	React.useEffect(() => {
		if (!cart) navigate('Carts');
	}, [cart]);

	const handleSubmit = async () => {
		if (data?.currentUser.id && cart?.storeId) {
			const { data: orderData } = await placeOrder({
				input: { user_id: data.currentUser.id, store_id: cart.storeId }
			});

			if (orderData?.createOrder) {
				createOrderItems({ input: prepareCart(orderData.createOrder.id) });
			}
		}
	};

	return (
		<View style={styles.container}>
			<Text style={{ fontWeight: 'bold', fontSize: 32 }}>Checkout</Text>
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
