import React from 'react';
import {
	CartQuery,
	useCartQuery,
	useCreateOrderMutation,
	useUpdateCartProductMutation
} from '../../types/api';
import useStore from '../../state';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';

interface CartContextType {
	cart: CartQuery['cart'];
	products: CartQuery['cart']['products'];
	disabled: boolean;
	handleSubmit: () => Promise<void>;
	refreshing: boolean;
	refresh: () => void;
	selectedCard: string;
	setSelectedCard: (cardId: string) => void;
	updateProductQuantity: (productId: string, quantity: number) => void;
	addProductToCart: (productId: string, quantity: number) => void;
	removeProductFromCart: (productId: string) => void;
	dispatch: React.Dispatch<{
		type: 'add' | 'remove' | 'update';
		product: CartQuery['cart']['products'][number];
	}>;
}

const CartContext = React.createContext<CartContextType | null>(null);

interface CartProviderProps {
	children: React.ReactNode;
	cart: CartQuery['cart'];
	refreshing: boolean;
	refresh: () => void;
}

export const CartProvider: React.FC<CartProviderProps> = ({
	children,
	cart,
	refreshing,
	refresh
}) => {
	const [{ fetching: isUpdatingCartProduct }, updateCartProduct] =
		useUpdateCartProductMutation();
	const [{ fetching: isCreatingOrder }, createOrder] = useCreateOrderMutation();

	const { navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();

	const { defaultCard, setPreference } = useStore();
	const [selectedCard, setSelectedCard] = React.useState(defaultCard);
	const { state, dispatch } = useCartReducer(cart.products);

	React.useEffect(() => {
		const firstCard = cart.user.cards[0];

		if (firstCard && !defaultCard && !selectedCard) {
			setSelectedCard(firstCard.id);
		}
	}, [cart.user.cards, defaultCard, selectedCard]);

	const disabled = isUpdatingCartProduct || isCreatingOrder;

	const addProductToCart = (productId: string, quantity: number) => {
		// if (quantity < 1) return;

		updateCartProduct({
			input: {
				cartId: cart.id,
				productId,
				quantity
			}
		});
	};

	const removeProductFromCart = (productId: string) => {
		updateCartProduct({
			input: {
				cartId: cart.id,
				productId,
				quantity: 0
			}
		});
	};

	const updateProductQuantity = async (productId: string, quantity: number) => {
		if (quantity < 1) return removeProductFromCart(productId);

		const { error } = await updateCartProduct({
			input: {
				cartId: cart.id,
				productId,
				quantity
			}
		});

		if (error) {
			console.log('Error while updating product quantity:', error);
		}
	};

	const handleSubmit = async () => {
		const { error, data: orderData } = await createOrder({
			input: {
				cartId: cart.id,
				cardId: selectedCard,
				transactionFee: cart.fees.total ?? 0,
				serviceFee: cart.fees.service ?? 0
			}
		});

		setPreference({ defaultCard: selectedCard });

		if (error) {
			console.log('Error while creating order:', error);
		} else {
			if (!selectedCard && orderData?.createOrder.total) {
				// TODO: Open a modal to add a payment method (with the total as an argument)
				navigate('Add Card', { orderId: orderData.createOrder.id });
			} else {
				goBack();
			}
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				products: state,
				disabled,
				handleSubmit,
				refreshing,
				refresh,
				selectedCard,
				setSelectedCard,
				updateProductQuantity,
				addProductToCart,
				removeProductFromCart,
				dispatch
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

const useCartReducer = (initialState: CartQuery['cart']['products']) => {
	const [state, dispatch] = React.useReducer(
		(
			state: CartQuery['cart']['products'],
			action: {
				type: 'add' | 'remove' | 'update';
				product: CartQuery['cart']['products'][number];
			}
		) => {
			switch (action.type) {
				case 'add':
					return [...state, action.product];
				case 'remove':
					return state.filter(
						product => product.productId !== action.product.productId
					);
				case 'update':
					return state.map(product =>
						product.productId === action.product.productId
							? {
									...product,
									quantity: Math.max(action.product.quantity, 0)
								}
							: product
					);
			}
		},
		initialState
	);

	return { state, dispatch };
};

interface CartContextWrapperProps {
	children: React.ReactNode;
}

const CartContextWrapper: React.FC<CartContextWrapperProps> = ({
	children
}) => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const [{ data, fetching }, refetch] = useCartQuery({
		variables: { cartId }
	});

	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	if (!data?.cart) return null;

	return (
		<CartProvider cart={data.cart} refreshing={refreshing} refresh={refresh}>
			{children}
		</CartProvider>
	);
};

export const useCart = () => {
	const context = React.useContext(CartContext);

	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}

	return context;
};

export default CartContextWrapper;
