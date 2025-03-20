import {
	HoldableButton,
	ScrollableScreen,
	Separator,
	Spacer,
	useTheme
} from '@habiti/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
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
import useRefresh from '../hooks/useRefresh';
import { useShallow } from 'zustand/shallow';

// There is a need to master optimistic updates on this screen,
// It is also important to make use of tasteful animations to make
// it feel slick.

const Cart: React.FC = () => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const { goBack } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const [{ data, fetching }, refetch] = useCartQuery({ variables: { cartId } });
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const [, createOrder] = useCreateOrderMutation();

	const { defaultCardId, setPreference } = useStore(
		useShallow(state => ({
			defaultCardId: state.defaultCard,
			setPreference: state.setPreference
		}))
	);
	const { bottom } = useSafeAreaInsets();
	const { theme } = useTheme();

	const [selectedCard, setSelectedCard] = React.useState(defaultCardId);

	const handleSubmit = React.useCallback(async () => {
		const { error } = await createOrder({
			input: {
				cartId,
				cardId: selectedCard,
				transactionFee: data?.cart.fees.total ?? 0,
				serviceFee: data?.cart.fees.service ?? 0
			}
		});

		setPreference({ defaultCard: selectedCard });

		if (error) {
			console.log('Error while creating order:', error);
		} else {
			goBack();
		}
	}, [data, cartId, selectedCard]);

	const cart = data?.cart;

	return (
		<ScrollableScreen
			style={[styles.container, { paddingBottom: bottom }]}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			{cart && (
				<>
					<StoreInfo store={cart.store} />

					<CartSummary products={cart.products} />

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
						<HoldableButton
							text='Place Order'
							disabled={!selectedCard}
							onComplete={handleSubmit}
						/>
					</View>
				</>
			)}
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
