import { Button, ScrollableScreen, Typography } from '@market/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartProduct from '../components/cart/CartProduct';
import SelectCard from '../components/cart/SelectCard';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useCreateOrderMutation, useCartQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import { formatNaira } from '../utils/currency';

// Maintain a list of recently viewed stores and items.
// So that we can use them in the empty state for this screen.

const Cart: React.FC = () => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { goBack } = useNavigation<NavigationProp<AppStackParamList>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });
	const [, createOrder] = useCreateOrderMutation();

	const defaultCardId = useStore(state => state.defaultCard);
	const { bottom } = useSafeAreaInsets();

	const [selectedCard, setSelectedCard] = React.useState(defaultCardId);
	const cart = data?.cart;

	const handleSubmit = React.useCallback(async () => {
		try {
			await createOrder({ input: { cartId, cardId: selectedCard } });
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

	const handleCartProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching || !cart) return <View style={styles.loading} />;

	return (
		<ScrollableScreen style={[styles.container, { paddingBottom: bottom }]}>
			<Typography style={styles.sectionHeader}>Order Summary</Typography>

			{cart.products.map(cartProduct => (
				<CartProduct
					key={cartProduct.id}
					cartProduct={cartProduct}
					onPress={handleCartProductPress(cartProduct.id)}
				/>
			))}

			<Typography style={styles.sectionHeader}>Delivery Address</Typography>

			<View>
				<Typography style={styles.sectionHeader}>Payment Method</Typography>
				<SelectCard
					selectedCard={selectedCard}
					onCardSelect={handleCardSelect}
				/>
			</View>

			<View style={[styles.row, { marginTop: 40 }]}>
				<Typography>Subtotal</Typography>
				<Typography>{formatNaira(cart.total)}</Typography>
			</View>

			<View style={styles.row}>
				<Typography>Service Fee</Typography>
				<Typography>-</Typography>
			</View>

			<View style={styles.row}>
				<Typography>Taxes</Typography>
				<Typography>-</Typography>
			</View>

			<View style={styles.bottom}>
				<Button
					text='Place Order'
					onPress={handleSubmit}
					style={styles.button}
				/>
			</View>
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	loading: {
		flex: 1
	},
	container: {
		paddingTop: 8,
		paddingHorizontal: 16
	},
	sectionHeader: {
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
		alignItems: 'center',
		marginBottom: 4
	},
	button: {
		marginTop: 16
	}
});

export default Cart;
