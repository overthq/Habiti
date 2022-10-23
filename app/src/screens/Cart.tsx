import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import { formatNaira } from '../utils/currency';
import useStore from '../state';

const Cart: React.FC = () => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { goBack } = useNavigation<NavigationProp<AppStackParamList>>();

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });
	const [, createOrder] = useCreateOrderMutation();

	const defaultCardId = useStore(state => state.defaultCard);

	const [selectedCard, setSelectedCard] = React.useState(defaultCardId);
	const cart = data?.cart;

	const handleSubmit = React.useCallback(async () => {
		try {
			await createOrder({ cartId });
			goBack();
		} catch (error) {
			console.log(error);
		}
	}, [cartId]);

	const handleCardSelect = React.useCallback(
		(cardId: string) => () => {
			setSelectedCard(cardId);
		},
		[]
	);

	if (fetching || !cart) {
		return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
	}

	return (
		<BottomSheetModalProvider>
			<SafeAreaView style={styles.container}>
				<Text style={styles.heading}>Checkout</Text>
				<Text style={styles.sectionHeader}>Order Summary</Text>
				{cart.products.map(cartProduct => (
					<CartProduct key={cartProduct.id} cartProduct={cartProduct} />
				))}
				<View style={styles.bottom}>
					<View style={styles.row}>
						<Text style={styles.total}>Total</Text>
						<Text style={styles.total}>{formatNaira(cart.total)}</Text>
					</View>
					<SelectCard
						selectedCard={selectedCard}
						onCardSelect={handleCardSelect}
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
	bottom: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	total: {
		fontSize: 16,
		fontWeight: '500'
	},
	button: {
		marginTop: 16
	}
});

export default Cart;
