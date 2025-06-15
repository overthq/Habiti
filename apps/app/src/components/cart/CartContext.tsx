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
	disabled: boolean;
	handleSubmit: () => Promise<void>;
	refreshing: boolean;
	refresh: () => void;
	selectedCard: string;
	setSelectedCard: (cardId: string) => void;
}

const CartContext = React.createContext<CartContextType | null>(null);

interface CartProviderProps {
	children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const {
		params: { cartId }
	} = useRoute<RouteProp<AppStackParamList, 'Cart'>>();
	const [{ data, fetching }, refetch] = useCartQuery({
		variables: { cartId }
	});
	const [{ fetching: isUpdatingCartProduct }, updateCartProduct] =
		useUpdateCartProductMutation();
	const [{ fetching: isCreatingOrder }, createOrder] = useCreateOrderMutation();

	const { navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();

	const { defaultCard, setPreference } = useStore();
	const [selectedCard, setSelectedCard] = React.useState(defaultCard);
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	const disabled = isUpdatingCartProduct || isCreatingOrder;

	const cart = data?.cart;

	const addProductToCart = (productId: string, quantity: number) => {
		if (quantity < 1) return;

		updateCartProduct({
			input: {
				cartId,
				productId,
				quantity
			}
		});
	};

	const removeProductFromCart = (productId: string) => {
		updateCartProduct({
			input: {
				cartId,
				productId,
				quantity: 0
			}
		});
	};

	const setProductQuantity = (productId: string, quantity: number) => {
		updateCartProduct({
			input: {
				cartId,
				productId,
				quantity
			}
		});
	};

	const handleSubmit = async () => {
		const { error, data: orderData } = await createOrder({
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
				disabled,
				handleSubmit,
				refreshing,
				refresh,
				selectedCard,
				setSelectedCard
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = React.useContext(CartContext);

	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}

	return context;
};

export default CartContext;
