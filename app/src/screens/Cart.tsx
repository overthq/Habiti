import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartsContext } from '../contexts/CartsContext';
import CartItem from '../components/CartItem';

const Cart = () => {
	const { navigate } = useNavigation();
	const { params } = useRoute();
	const storeId = params?.storeId;

	const { carts } = React.useContext(CartsContext);

	const activeCart = carts.find(({ storeId: id }) => id === storeId);

	React.useEffect(() => {
		if (!activeCart) navigate('Carts');
	}, [activeCart]);

	return (
		<View style={styles.container}>
			<Text style={{ fontWeight: 'bold', fontSize: 32 }}>Checkout</Text>
			<Text
				style={{
					fontSize: 18,
					fontWeight: '500',
					color: '#505050',
					marginTop: 10
				}}
			>
				Order Summary
			</Text>
			{activeCart?.items.map(({ itemId, quantity }) => (
				<CartItem key={itemId} {...{ itemId, quantity }} />
			))}
			<TouchableOpacity activeOpacity={0.8} style={styles.orderButton}>
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
	}
});

export default Cart;
