import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import CartProduct from '../components/cart/CartProduct';
import { useCreateOrderMutation, useCartQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const Cart: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const [, createOrder] = useCreateOrderMutation();
	const { cartId } = params;

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });
	const cart = data?.cart;

	if (fetching || !cart) return <View />;

	const handleSubmit = async () => {
		await createOrder({ cartId });
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.heading}>Checkout</Text>
			<Text style={styles.sectionHeader}>Order Summary</Text>
			{cart.products.map(({ productId, product, quantity }) => (
				<CartProduct key={productId} {...{ product, quantity }} />
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
