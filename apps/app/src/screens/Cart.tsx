import {
	Button,
	ScrollableScreen,
	Spacer,
	Typography
} from '@market/components';
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
import CartTotal from '../components/cart/CartTotal';
import DeliveryInfo from '../components/cart/DeliveryInfo';
import SelectCard from '../components/cart/SelectCard';
import StoreInfo from '../components/cart/StoreInfo';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useCreateOrderMutation, useCartQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// There is a need to master optimistic updates on this screen,
// It is also important to make use of tasteful animations to make
// it feel slick.

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
		[navigate]
	);

	const cart = data?.cart;

	if (fetching || !cart) return <View />;

	return (
		<ScrollableScreen style={[styles.container, { paddingBottom: bottom }]}>
			<StoreInfo store={cart.store} />

			<View style={{ paddingHorizontal: 16 }}>
				<Typography weight='medium' variant='secondary'>
					Order Summary
				</Typography>

				<Spacer y={2} />

				{cart.products.map(cartProduct => (
					<CartProduct
						key={cartProduct.id}
						cartProduct={cartProduct}
						onPress={handleCartProductPress(cartProduct.productId)}
					/>
				))}
			</View>

			<Spacer y={16} />

			<DeliveryInfo />

			<Spacer y={16} />

			<View>
				<Typography
					weight='medium'
					variant='secondary'
					style={{ marginLeft: 16 }}
				>
					Payment Method
				</Typography>
				<Spacer y={8} />
				<SelectCard
					cards={cart.user.cards}
					selectedCard={selectedCard}
					onCardSelect={handleCardSelect}
				/>
			</View>

			<Spacer y={40} />

			<CartTotal cart={cart} />

			<View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
				<Button text='Place Order' onPress={handleSubmit} />
			</View>
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	loading: {
		flex: 1
	},
	container: {
		paddingTop: 16
	}
});

export default Cart;
