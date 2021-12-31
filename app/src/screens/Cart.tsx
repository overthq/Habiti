import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import CartProduct from '../components/cart/CartProduct';
import { useCreateOrderMutation, useCartQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';
import SelectCard from '../components/cart/SelectCard';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAppSelector } from '../redux/store';

const Cart: React.FC = () => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { goBack } = useNavigation<NavigationProp<AppStackParamList>>();
	const [, createOrder] = useCreateOrderMutation();

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });

	const defaultCardId = useAppSelector(
		({ preferences }) => preferences.defaultCardId
	);

	const [selectedCard, setSelectedCard] = React.useState(defaultCardId);
	const cart = data?.cart;

	const totalPrice = React.useMemo(() => {
		return (
			cart?.products.reduce((acc, next) => {
				return acc + next.product.unitPrice * next.quantity;
			}, 0) || 0
		);
	}, [cart?.products]);

	const handleSubmit = React.useCallback(async () => {
		try {
			await createOrder({ cartId });
			goBack();
		} catch (error) {
			console.log(error);
		}
	}, [cartId]);

	if (fetching || !cart) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<BottomSheetModalProvider>
			<SafeAreaView style={styles.container}>
				<Text style={styles.heading}>Checkout</Text>
				<Text style={styles.sectionHeader}>Order Summary</Text>
				{cart.products.map(cartProduct => (
					<CartProduct key={cartProduct.productId} cartProduct={cartProduct} />
				))}
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: '500' }}>Total</Text>
						<Text style={{ fontSize: 18, fontWeight: '500' }}>
							{totalPrice} NGN
						</Text>
					</View>
					<SelectCard
						selectedCard={selectedCard}
						handleCardSelect={setSelectedCard}
					/>
					<Button
						text='Place Order'
						onPress={handleSubmit}
						style={styles.button}
					/>
				</View>
			</SafeAreaView>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	heading: {
		fontWeight: 'bold',
		fontSize: 32,
		marginBottom: 16
	},
	sectionHeader: {
		fontSize: 17,
		fontWeight: '500',
		color: '#505050',
		marginVertical: 4
	},
	button: {
		marginTop: 16
	}
});

export default Cart;
