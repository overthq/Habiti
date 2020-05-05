import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface CartItem {
	itemId: string;
	quantity: number;
}

type AddItemToCart = (item: {
	storeId: string;
	itemId: string;
	quantity: number;
}) => void;

interface CartsContextValue {
	carts: Record<string, CartItem[]>;
	addItemToCart: AddItemToCart;
	removeItemFromCart(storeId: string, itemId: string): void;
}

export const CartsContext = React.createContext<CartsContextValue>({
	carts: {},
	addItemToCart: () => {
		/* noop */
	},
	removeItemFromCart: () => {
		/* noop */
	}
});

export const CartsProvider: React.FC = ({ children }) => {
	const [carts, setCarts] = React.useState<Record<string, CartItem[]>>({});

	React.useEffect(() => {
		// Load persisted carts.
		(async () => {
			try {
				const stringifiedCarts = await AsyncStorage.getItem('carts');
				if (!stringifiedCarts) return setCarts({});
				const loadedCarts = JSON.parse(stringifiedCarts);
				setCarts(loadedCarts);
			} catch (error) {
				setCarts({});
			}
		})();
	}, []);

	React.useEffect(() => {
		// Persist carts state to Async Storage.
		AsyncStorage.setItem('carts', JSON.stringify(carts));
	}, [carts]);

	const addItemToCart: AddItemToCart = ({ itemId, storeId, quantity }) => {
		setCarts({
			...carts,
			[storeId]: [...carts[storeId], { itemId, quantity }]
		});
	};

	const removeItemFromCart = (storeId: string, itemId: string) => {
		const cartsCopy = { ...carts };
		const indexOfItemToRemove = cartsCopy[storeId].findIndex(
			({ itemId: id }) => itemId === id
		);
		if (indexOfItemToRemove > -1)
			cartsCopy[storeId].splice(indexOfItemToRemove, 1);
		setCarts(cartsCopy);
	};

	return (
		<CartsContext.Provider value={{ carts, addItemToCart, removeItemFromCart }}>
			{children}
		</CartsContext.Provider>
	);
};
