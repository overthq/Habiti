import React from 'react';

import {
	useCreateOrderMutation,
	useUpdateCartProductQuantityMutation
} from '@/data/mutations';
import { useCartQuery } from '@/data/queries';

import { usePreferenceStore } from '@/state/preference-store';
import useDebounce from '@/hooks/use-debounce';
import { Cart, CartProduct } from '@/data/types';
import { useParams } from 'next/navigation';

interface CartContextType {
	cart: Cart;
	products: CartProduct[];
	disabled: boolean;
	handleSubmit: () => Promise<void>;
	selectedCard: string | null;
	setSelectedCard: (cardId: string) => void;
	updateProductQuantity: (productId: string, quantity: number) => void;
	removeProductFromCart: (productId: string) => void;
	dispatch: React.Dispatch<Action>;
}

const CartContext = React.createContext<CartContextType | null>(null);

interface CartProviderProps {
	children: React.ReactNode;
	cart: Cart;
}

export const CartProvider: React.FC<CartProviderProps> = ({
	children,
	cart
}) => {
	const updateCartProductQuantityMutation =
		useUpdateCartProductQuantityMutation();

	const createOrderMutation = useCreateOrderMutation();

	const { defaultCard, setPreference } = usePreferenceStore();
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
			updateCartProductQuantityMutation.isPending ||
			createOrderMutation.isPending ||
			pendingUpdatesRef.current.size > 0
		);
	}, [
		updateCartProductQuantityMutation.isPending,
		createOrderMutation.isPending
	]);

	const processBatchedUpdates = React.useCallback(() => {
		const updates = Array.from(pendingUpdatesRef.current.entries());
		if (updates.length === 0) return;

		updates.forEach(([productId, quantity]) => {
			updateCartProductQuantityMutation.mutate({
				cartId: cart.id,
				productId,
				quantity
			});
		});

		pendingUpdatesRef.current.clear();
	}, [cart.id, updateCartProductQuantityMutation]);

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
		dispatch({ type: 'update', productId, quantity });

		pendingUpdatesRef.current.set(productId, quantity);
		debouncedProcessBatchedUpdates();
	};

	const handleSubmit = React.useCallback(async () => {
		createOrderMutation.mutate({
			cartId: cart.id,
			cardId: selectedCard,
			transactionFee: cart.fees.total ?? 0,
			serviceFee: cart.fees.service ?? 0
		});

		setPreference({ defaultCard: selectedCard });
	}, [
		cart.id,
		cart.fees.total,
		cart.fees.service,
		selectedCard,
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
	const { id: cartId } = useParams<{ id: string }>();

	const { data, isLoading } = useCartQuery(cartId);

	if (!data?.cart) return null;

	return <CartProvider cart={data.cart}>{children}</CartProvider>;
};

export const useCart = () => {
	const context = React.useContext(CartContext);

	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}

	return context;
};

export default CartContextWrapper;
