import React from 'react';
import {
	Button,
	CustomImage,
	Icon,
	Row,
	ScrollableScreen,
	SelectGroup,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { View, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import CartProvider, { useCart } from '../components/CartContext';
import { AppStackParamList } from '../navigation/types';
import type {
	Cart as CartType,
	CartProduct as CartProductType,
	Card,
	Store
} from '../data/types';

interface StoreInfoProps {
	store: Store;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
	return (
		<View>
			<Typography size='xlarge' weight='semibold'>
				{store.name}
			</Typography>
		</View>
	);
};

interface CartProductQuantityProps {
	cartProduct: CartProductType;
	quantity: number;
	maxQuantity: number;
}

const CartProductQuantity: React.FC<CartProductQuantityProps> = ({
	cartProduct,
	quantity
}) => {
	const { theme } = useTheme();
	const { updateProductQuantity } = useCart();

	const incrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, quantity + 1);
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	const decrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, Math.max(quantity - 1, 0));
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	return (
		<View
			style={[
				styles.quantityInput,
				{ backgroundColor: theme.input.background }
			]}
		>
			<Pressable onPress={decrementProductQuantity} hitSlop={12}>
				<Icon name='minus' size={20} color={theme.text.primary} />
			</Pressable>
			<Typography weight='medium' style={{ width: 24, textAlign: 'center' }}>
				{quantity}
			</Typography>
			<Pressable onPress={incrementProductQuantity} hitSlop={12}>
				<Icon name='plus' size={20} color={theme.text.primary} />
			</Pressable>
		</View>
	);
};

interface CartProductProps {
	cartProduct: CartProductType;
	onPress(): void;
}

const CartProduct: React.FC<CartProductProps> = ({ cartProduct, onPress }) => {
	const { product, quantity } = cartProduct;

	const hasExceededMaxQuantity = quantity > product.quantity;

	return (
		<Row style={styles.cartProductContainer} onPress={onPress}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<CustomImage uri={product.images[0]?.path} height={48} width={48} />
				<Spacer x={12} />
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography
						weight='medium'
						variant={hasExceededMaxQuantity ? 'error' : 'secondary'}
					>
						{formatNaira(product.unitPrice * quantity)}
					</Typography>
				</View>
			</View>
			<View>
				<CartProductQuantity
					cartProduct={cartProduct}
					quantity={quantity}
					maxQuantity={product.quantity}
				/>
				<Spacer y={4} />
			</View>
		</Row>
	);
};

interface CartSummaryProps {
	products: CartProductType[];
}

const CartSummary: React.FC<CartSummaryProps> = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { products } = useCart();

	const handleCartProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[navigate]
	);

	return (
		<View>
			<Typography weight='medium' variant='secondary'>
				Order Summary
			</Typography>

			<Spacer y={4} />

			{products.map(cartProduct => (
				<CartProduct
					key={`${cartProduct.cartId}-${cartProduct.productId}`}
					cartProduct={cartProduct}
					onPress={handleCartProductPress(cartProduct.productId)}
				/>
			))}
		</View>
	);
};

interface SelectCardProps {
	cards: Card[];
	selectedCard?: string;
	onCardSelect(cardId: string): void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	cards,
	selectedCard,
	onCardSelect
}) => {
	const { theme } = useTheme();

	return (
		<View>
			<Typography weight='medium' variant='secondary'>
				Payment Method
			</Typography>
			<Spacer y={8} />
			{cards.length === 0 ? (
				<View
					style={{
						backgroundColor: theme.input.background,
						padding: 12,
						borderRadius: 6
					}}
				>
					<Typography weight='medium' size='large'>
						No payment methods
					</Typography>
					<Spacer y={4} />
					<Typography variant='secondary'>
						You will be prompted to add a payment method when you place this
						order.
					</Typography>
				</View>
			) : (
				<SelectGroup
					selected={selectedCard}
					options={cards.map(card => ({
						title: `${card.cardType} ••••${card.last4}`,
						value: card.id
					}))}
					onSelect={onCardSelect}
					capitalize
				/>
			)}
		</View>
	);
};

interface CartTotalRowProps {
	title: string;
	value: string;
	total?: boolean;
}

const CartTotalRow: React.FC<CartTotalRowProps> = ({ title, value, total }) => {
	return (
		<View style={styles.totalRow}>
			<Typography
				variant={total ? 'primary' : 'secondary'}
				weight={total ? 'medium' : 'regular'}
			>
				{title}
			</Typography>
			<Typography
				variant={total ? 'primary' : 'secondary'}
				weight={total ? 'medium' : 'regular'}
			>
				{value}
			</Typography>
		</View>
	);
};

interface CartTotalProps {
	cart: CartType;
}

const CartTotal: React.FC<CartTotalProps> = ({ cart }) => {
	return (
		<View>
			<CartTotalRow title='Subtotal' value={formatNaira(cart.total)} />
			<CartTotalRow
				title='Transaction Fee'
				value={formatNaira(cart.fees.transaction)}
			/>
			<CartTotalRow
				title='Service Fee'
				value={formatNaira(cart.fees.service)}
			/>
			<CartTotalRow
				title='Total'
				value={formatNaira(cart.fees.total + cart.total)}
				total
			/>
		</View>
	);
};

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

			<Spacer y={16} />

			<Button text='Place Order' onPress={handleSubmit} disabled={disabled} />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	cartProductContainer: {
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 6,
		marginHorizontal: -16
	},
	quantityInput: {
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		alignSelf: 'flex-start'
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	}
});

const CartWrapper = () => {
	return (
		<CartProvider>
			<Cart />
		</CartProvider>
	);
};

export default CartWrapper;
