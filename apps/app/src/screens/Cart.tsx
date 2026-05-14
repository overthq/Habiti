import React from 'react';
import {
	Button,
	ScrollableScreen,
	Separator,
	Spacer,
	useTheme
} from '@habiti/components';
import { View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartSummary from '../components/cart/CartSummary';
import CartTotal from '../components/cart/CartTotal';
import SelectCard from '../components/cart/SelectCard';
import StoreInfo from '../components/cart/StoreInfo';
import CartProvider, { useCart } from '../components/cart/CartContext';

// There is a need to master optimistic updates on this screen,
// It is also important to make use of tasteful animations to make
// it feel slick.

const Cart: React.FC = () => {
	const { bottom } = useSafeAreaInsets();
	const { theme } = useTheme();

	const {
		cart,
		disabled,
		handleSubmit,
		refreshing,
		refresh,
		selectedCard,
		setSelectedCard
	} = useCart();

	return (
		<ScrollableScreen
			style={{ paddingBottom: bottom }}
			contentContainerStyle={{ backgroundColor: theme.screen.background }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			<Spacer y={16} />

			<StoreInfo store={cart.store} />

			<Spacer y={4} />

			<CartSummary products={cart.products} />

			<Spacer y={16} />

			<SelectCard
				cards={cart.user.cards}
				selectedCard={selectedCard}
				onCardSelect={setSelectedCard}
			/>

			<Spacer y={16} />

			<Separator style={{ margin: 16 }} />

			<Spacer y={16} />

			<CartTotal cart={cart} />

			<View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
				<Button text='Place Order' onPress={handleSubmit} disabled={disabled} />
			</View>
		</ScrollableScreen>
	);
};

const CartWrapper = () => {
	return (
		<CartProvider>
			<Cart />
		</CartProvider>
	);
};

export default CartWrapper;
