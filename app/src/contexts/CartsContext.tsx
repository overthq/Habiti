import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export interface Cart {
	storeId: string;
	items: {
		itemId: string;
		quantity: number;
	}[];
}

type AddItemToCart = (item: {
	storeId: string;
	itemId: string;
	quantity: number;
}) => void;

interface CartsContextValue {
	carts: Cart[];
	addItemToCart: AddItemToCart;
	removeItemFromCart(storeId: string, itemId: string): void;
}

export const CartsContext = React.createContext<CartsContextValue>({
	carts: [],
	addItemToCart: () => {
		/* noop */
	},
	removeItemFromCart: () => {
		/* noop */
	}
});

export const CartsProvider: React.FC = ({ children }) => {
	const [carts, setCarts] = React.useState<Cart[]>([]);

	React.useEffect(() => {
		// Load persisted carts.
		(async () => {
			try {
				const stringifiedCarts = await AsyncStorage.getItem('carts');
				if (!stringifiedCarts) return setCarts([]);
				const loadedCarts = JSON.parse(stringifiedCarts);
				setCarts(loadedCarts);
			} catch (error) {
				setCarts([]);
			}
		})();
	}, []);

	React.useEffect(() => {
		// Persist carts state to Async Storage.
		AsyncStorage.setItem('carts', JSON.stringify(carts));
	}, [carts]);

	const addItemToCart: AddItemToCart = ({ storeId, itemId, quantity }) => {
		const cartsCopy = [...carts];
		const cartToAddItemTo = cartsCopy.find(({ storeId: id }) => storeId === id);
		if (!cartToAddItemTo) {
			cartsCopy.push({ storeId, items: [{ itemId, quantity }] });
		} else {
			const existingItem = cartToAddItemTo.items.find(
				({ itemId: id }) => itemId === id
			);
			if (!existingItem) {
				cartToAddItemTo?.items.push({ itemId, quantity });
			} else {
				existingItem.quantity = quantity;
			}
		}
		setCarts(cartsCopy);
	};

	const removeItemFromCart = (storeId: string, itemId: string) => {
		const cartsCopy = [...carts];
		const selectedCart = cartsCopy.find(({ storeId: id }) => storeId === id);
		const indexOfItemToRemove = selectedCart?.items.findIndex(
			({ itemId: id }) => itemId === id
		);
		if (indexOfItemToRemove && indexOfItemToRemove > -1)
			selectedCart?.items.splice(indexOfItemToRemove, 1);
		setCarts(cartsCopy);
	};

	return (
		<CartsContext.Provider value={{ carts, addItemToCart, removeItemFromCart }}>
			{children}
		</CartsContext.Provider>
	);
};
