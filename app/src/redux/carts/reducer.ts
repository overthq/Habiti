import {
	CartsActionTypes,
	UPSERT_ITEM,
	REMOVE_ITEM,
	CartsState
} from './types';

const initialState: CartsState = {
	carts: []
};

const cartsReducer = (
	state = initialState,
	action: CartsActionTypes
): CartsState => {
	const cartsCopy = [...state.carts];
	const existingCart = cartsCopy.find(
		cart => cart.storeId === action.payload.storeId
	);
	switch (action.type) {
		case UPSERT_ITEM:
			if (existingCart) {
				const existingItem = existingCart.items.find(
					item => item.itemId === action.payload.itemId
				);
				if (existingItem) {
					existingItem.quantity = action.payload.quantity;
				} else {
					existingCart.items.push({
						itemId: action.payload.itemId,
						quantity: action.payload.quantity
					});
				}
			} else {
				cartsCopy.push({
					storeId: action.payload.storeId,
					items: [
						{
							itemId: action.payload.itemId,
							quantity: action.payload.quantity
						}
					]
				});
			}

			return { carts: cartsCopy };

		case REMOVE_ITEM:
			if (existingCart) {
				const existingItem = existingCart.items.find(
					item => item.itemId === action.payload.itemId
				);
				if (existingItem) {
					const index = existingCart.items.indexOf(existingItem);
					if (index > -1) {
						existingCart.items.splice(index, 1);
					}
				}
			}

			return { carts: cartsCopy };
		default:
			return state;
	}
};

export default cartsReducer;
