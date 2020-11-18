import {
	CartsActionTypes,
	UPSERT_ITEM,
	REMOVE_ITEM,
	CartsState
} from './types';

const initialState: CartsState = {
	carts: {} as { [key: string]: { [key: string]: number } }
};

const cartsReducer = (state = initialState, action: CartsActionTypes) => {
	switch (action.type) {
		case UPSERT_ITEM:
			return {
				carts: {
					...state.carts,
					[action.payload.storeId]: {
						...state.carts[action.payload.storeId],
						[action.payload.itemId]: action.payload.quantity
					}
				}
			};
		case REMOVE_ITEM:
			return {
				carts: {
					...state.carts
				}
			};
		default:
			return state;
	}
};

export default cartsReducer;
