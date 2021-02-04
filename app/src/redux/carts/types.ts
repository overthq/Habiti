export const UPSERT_ITEM = 'UPSERT_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

interface Cart {
	storeId: string;
	items: {
		itemId: string;
		quantity: number;
	}[];
}

export interface CartsState {
	carts: Cart[];
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
