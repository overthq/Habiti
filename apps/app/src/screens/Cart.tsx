import {
	Button,
	ScrollableScreen,
	Separator,
	Spacer
} from '@habiti/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartSummary from '../components/cart/CartSummary';
import CartTotal from '../components/cart/CartTotal';
// import DeliveryInfo from '../components/cart/DeliveryInfo';
import SelectCard from '../components/cart/SelectCard';
import StoreInfo from '../components/cart/StoreInfo';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useCreateOrderMutation, useCartQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// There is a need to master optimistic updates on this screen,
// It is also important to make use of tasteful animations to make
// it feel slick.

// A cart screen is usually distinct from a checkout screen on most
// production apps. Find out why.

const Cart: React.FC = () => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { goBack } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const [{ data, fetching }] = useCartQuery({ variables: { cartId } });
	const [, createOrder] = useCreateOrderMutation();

	const { defaultCardId, setPreference } = useStore(state => ({
		defaultCardId: state.defaultCard,
		setPreference: state.setPreference
	}));
	const { bottom } = useSafeAreaInsets();

	const [selectedCard, setSelectedCard] = React.useState(defaultCardId);

	const handleSubmit = React.useCallback(async () => {
		const { error } = await createOrder({
			input: { cartId, cardId: selectedCard }
		});

		setPreference({ defaultCard: selectedCard });

		if (error) {
			// TODO: Alert the user that something has gone wrong.
			// Also, why does this feel like writing Go?
			console.log(error);
		} else {
			goBack();
		}
	}, [cartId]);

	const cart = data?.cart;

	if (fetching || !cart) return <View />;

	return (
		<ScrollableScreen style={[styles.container, { paddingBottom: bottom }]}>
			<StoreInfo store={cart.store} />

			<CartSummary products={cart.products} />

			<Spacer y={16} />

			{/* <DeliveryInfo /> */}

			<Spacer y={16} />

			<SelectCard
				cards={cart.user.cards}
				selectedCard={selectedCard}
				onCardSelect={setSelectedCard}
			/>

			<Separator style={{ margin: 16 }} />

			<CartTotal cart={cart} />

			<View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
				<Button
					text='Place Order'
					onPress={handleSubmit}
					disabled={!selectedCard}
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
		paddingTop: 16
	}
});

export default Cart;
