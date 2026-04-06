import React from 'react';
import {
	NavigationProp,
	RouteProp,
	useFocusEffect,
	useNavigation,
	useRoute
} from '@react-navigation/native';

import { useCartQuery } from '../../data/queries';
import {
	useCreateOrderMutation,
	useUpdateCartProductMutation
} from '../../data/mutations';
import type { Cart, CartProduct } from '../../data/types';
import useStore from '../../state';
import { AppStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';
import useDebounce from '../../hooks/useDebounce';

interface CartContextType {
	cart: Cart;
	products: CartProduct[];
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
	cart: Cart;
	cards: import('../../data/types').Card[];
	refreshing: boolean;
	refresh: () => void;
}

export const CartProvider: React.FC<CartProviderProps> = ({
	children,
	cart,
	cards,
	refreshing,
	refresh
}) => {
	const updateCartProductMutation = useUpdateCartProductMutation();
	const createOrderMutation = useCreateOrderMutation();

	const { navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();

	const { defaultCard, setPreference } = useStore();
	const [selectedCard, setSelectedCard] = React.useState(defaultCard);
	const { state, dispatch } = useCartReducer(cart.products);

	React.useEffect(() => {
		dispatch({ type: 'reset', products: cart.products });
	}, [cart.products, dispatch]);

	React.useEffect(() => {
		const firstCard = cards[0];

		if (firstCard && !defaultCard && !selectedCard) {
			setSelectedCard(firstCard.id);
		}
	}, [cards, defaultCard, selectedCard]);

	const anyCartProductIsOverQuantity = React.useMemo(() => {
		return state.some(product => product.quantity > product.product.quantity);
	}, [state]);

	const pendingUpdatesRef = React.useRef<Map<string, number>>(new Map());

	const disabled = React.useMemo(() => {
		return (
			updateCartProductMutation.isPending ||
			createOrderMutation.isPending ||
			pendingUpdatesRef.current.size > 0 ||
			anyCartProductIsOverQuantity
		);
	}, [
		updateCartProductMutation.isPending,
		createOrderMutation.isPending,
		pendingUpdatesRef.current.size,
		anyCartProductIsOverQuantity
	]);

	const processBatchedUpdates = React.useCallback(() => {
		const updates = Array.from(pendingUpdatesRef.current.entries());
		if (updates.length === 0) return;

		updates.forEach(([productId, quantity]) => {
			updateCartProductMutation.mutate({
				productId,
				body: {
					cartId: cart.id,
					quantity
				}
			});
		});

		pendingUpdatesRef.current.clear();
	}, [cart.id, updateCartProductMutation]);

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

	// When the user comes back from the "Modal.AddCard" screen, we navigate them back
	// to the screen they visited before the cart screen
	// This is a workaround. In the future, when the navigation structure is set
	// up better, we should not need to do this.
	useFocusEffect(
		React.useCallback(() => {
			if (createOrderMutation.data?.order.id) {
				goBack();
			}
		}, [goBack, createOrderMutation.data])
	);

	const handleSubmit = React.useCallback(async () => {
		try {
			const orderData = await createOrderMutation.mutateAsync({
				cartId: cart.id,
				cardId: selectedCard
			});

			// TODO: Consider not doing this
			setPreference({ defaultCard: selectedCard });

			if (!selectedCard && orderData?.order.total) {
				navigate('Modal.AddCard', { orderId: orderData.order.id });
			} else {
				goBack();
			}
		} catch (error) {
			console.log('Error while creating order:', error);
		}
	}, [
		cart.id,
		cart.fees.total,
		cart.fees.service,
		selectedCard,
		navigate,
		goBack,
		createOrderMutation,
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
	product: CartProduct;
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
	products: CartProduct[];
};

type Action = AddAction | RemoveAction | UpdateAction | ResetAction;

const useCartReducer = (initialState: CartProduct[]) => {
	const [state, dispatch] = React.useReducer(
		(state: CartProduct[], action: Action) => {
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
	const { data, isLoading, refetch } = useCartQuery(cartId);

	const { refreshing, refresh } = useRefresh({ refetch });

	if (!data?.cart) return null;

	return (
		<CartProvider
			cart={data.cart}
			cards={data.viewerContext?.cards ?? []}
			refreshing={refreshing}
			refresh={refresh}
		>
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
