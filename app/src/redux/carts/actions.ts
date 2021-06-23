import { AppThunk } from '../store';
import { UPSERT_ITEM, REMOVE_ITEM } from './types';

interface UpsertItemActionPayload {
	storeId: string;
	itemId: string;
	quantity?: number;
}

export const upsertItemToCart = ({
	storeId,
	itemId,
	quantity = 1
}: UpsertItemActionPayload): AppThunk => dispatch => {
	dispatch({
		type: UPSERT_ITEM,
		payload: {
			storeId,
			itemId,
			quantity
		}
	});
};

interface RemoveItemActionPayload {
	storeId: string;
	itemId: string;
}

export const removeItemFromCart = ({
	storeId,
	itemId
}: RemoveItemActionPayload): AppThunk => async (dispatch, getState) => {
	// It makes sense to check if the item actually exists here, instead of the reducer.
	// Reduces the complexity of determining the next state.

	const { carts } = getState();

	const associatedCart = carts.carts.find(cart => cart.storeId === storeId);
	const associatedItem = associatedCart?.items.find(
		item => item.itemId === itemId
	);

	// Remove this tautology.
	if (associatedCart && associatedItem) {
		dispatch({
			type: REMOVE_ITEM,
			payload: {
				storeId,
				itemId
			}
		});
	}
};
