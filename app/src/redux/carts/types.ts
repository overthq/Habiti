export const UPSERT_ITEM = 'UPSERT_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

// storeId: {
// 	itemId: quantity,
// 	anotherItemId: anotherItemQuantity
// }

export interface CartsState {
	carts: {
		[key: string]: {
			[key: string]: number;
		};
	};
}

interface UpsertItemAction {
	type: typeof UPSERT_ITEM;
	payload: {
		storeId: string;
		itemId: string;
		quantity: number;
	};
}

interface RemoveItemAction {
	type: typeof REMOVE_ITEM;
	payload: {
		storeId: string;
		itemId: string;
	};
}

export type CartsActionTypes = UpsertItemAction | RemoveItemAction;
