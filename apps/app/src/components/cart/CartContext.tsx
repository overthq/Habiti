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
import useDebounce from '../../hooks/useDebounce';

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
	removeProductFromCart: (productId: string) => void;
	dispatch: React.Dispatch<Action>;
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
		dispatch({ type: 'reset', products: cart.products });
	}, [cart.products, dispatch]);

	React.useEffect(() => {
		const firstCard = cart.user.cards[0];

		if (firstCard && !defaultCard && !selectedCard) {
			setSelectedCard(firstCard.id);
		}
	}, [cart.user.cards, defaultCard, selectedCard]);

	const pendingUpdatesRef = React.useRef<Map<string, number>>(new Map());

	const disabled = React.useMemo(() => {
		return (
			isUpdatingCartProduct ||
			isCreatingOrder ||
			pendingUpdatesRef.current.size > 0
		);
	}, [isUpdatingCartProduct, isCreatingOrder]);

	const processBatchedUpdates = React.useCallback(() => {
		const updates = Array.from(pendingUpdatesRef.current.entries());
		if (updates.length === 0) return;

		updates.forEach(([productId, quantity]) => {
			updateCartProduct({
				input: {
					cartId: cart.id,
					productId,
					quantity
				}
			});
		});

		pendingUpdatesRef.current.clear();
	}, [cart.id, updateCartProduct]);

	const debouncedProcessBatchedUpdates = useDebounce(
		processBatchedUpdates,
		1000
	);

	const removeProductFromCart = (productId: string) => {
		dispatch({ type: 'remove', productId });

		pendingUpdatesRef.current.set(productId, 0);
		debouncedProcessBatchedUpdates();
	};

	const updateProductQuantity = async (productId: string, quantity: number) => {
		// if (quantity < 1) return removeProductFromCart(productId);
		dispatch({ type: 'update', productId, quantity });

		pendingUpdatesRef.current.set(productId, quantity);
		debouncedProcessBatchedUpdates();
	};

	const handleSubmit = React.useCallback(async () => {
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
				navigate('Add Card', { orderId: orderData.createOrder.id });
			} else {
				goBack();
			}
		}
	}, [
		cart.id,
		cart.fees.total,
		cart.fees.service,
		selectedCard,
		navigate,
		goBack,
		createOrder,
		setPreference
	]);

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
				removeProductFromCart,
				dispatch
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

type AddAction = {
	type: 'add';
	product: CartQuery['cart']['products'][number];
};

type RemoveAction = {
	type: 'remove';
	productId: string;
};

type UpdateAction = {
	type: 'update';
	productId: string;
	quantity: number;
};

type ResetAction = {
	type: 'reset';
	products: CartQuery['cart']['products'];
};

type Action = AddAction | RemoveAction | UpdateAction | ResetAction;

const useCartReducer = (initialState: CartQuery['cart']['products']) => {
	const [state, dispatch] = React.useReducer(
		(state: CartQuery['cart']['products'], action: Action) => {
			switch (action.type) {
				case 'add':
					return [...state, action.product];
				case 'remove':
					return state.filter(
						product => product.productId !== action.productId
					);
				case 'update':
					return state.map(product =>
						product.productId === action.productId
							? {
									...product,
									quantity: Math.max(action.quantity, 0)
								}
							: product
					);
				case 'reset':
					return action.products;
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
