import React from 'react';
import { Platform } from 'react-native';

import {
	registerResolver,
	resolveRequest,
	useSheetStore
} from '../state/sheet';
import { navigationRef } from './utils';

export type SheetName =
	| 'productMenu'
	| 'productPrice'
	| 'productInventory'
	| 'storeSelect'
	| 'productsFilter'
	| 'ordersFilter';

export interface SheetParams {
	productMenu: {
		onEditProduct: () => void;
		onDeleteProduct: () => void;
		onShareProduct: () => void;
		onViewInBrowser: () => void;
	};
	productPrice: { productId: string; initialPrice: number };
	productInventory: { productId: string; initialQuantity: number };
	storeSelect: undefined;
	productsFilter: undefined;
	ordersFilter: undefined;
}

export interface SheetResult {
	productMenu: void;
	productPrice: void;
	productInventory: void;
	storeSelect: void;
	productsFilter: void;
	ordersFilter: void;
}

// iOS formSheet route name per sheet. Kept in sync with AppStackParamList.
export const SHEET_ROUTE_NAMES = {
	productMenu: 'Sheet.ProductMenu',
	productPrice: 'Sheet.ProductPrice',
	productInventory: 'Sheet.ProductInventory',
	storeSelect: 'Sheet.StoreSelect',
	productsFilter: 'Sheet.ProductsFilter',
	ordersFilter: 'Sheet.OrdersFilter'
} as const satisfies Record<SheetName, string>;

type OpenArgs<Name extends SheetName> = SheetParams[Name] extends undefined
	? [name: Name]
	: [name: Name, params: SheetParams[Name]];

/**
 * Unified imperative sheet API. `openSheet` returns a promise that resolves when
 * the sheet closes — with the sheet's result (for sheets that return a value) or
 * `undefined` if it was dismissed via swipe/backdrop.
 */
export const useSheet = () => {
	const openSheet = React.useCallback(
		<Name extends SheetName>(
			...args: OpenArgs<Name>
		): Promise<SheetResult[Name]> => {
			const [name, params] = args as [Name, SheetParams[Name]];
			const id = useSheetStore.getState().present(name, params);

			return new Promise<SheetResult[Name]>(resolve => {
				registerResolver(id, resolve as (value: unknown) => void);

				if (Platform.OS === 'ios') {
					navigationRef.navigate(SHEET_ROUTE_NAMES[name] as never);
				}
				// Android: SheetHost reacts to the activeName change and presents.
			});
		},
		[]
	);

	const closeSheet = React.useCallback((result?: unknown) => {
		const { requestId } = useSheetStore.getState();
		resolveRequest(requestId, result);

		if (Platform.OS === 'ios') {
			if (navigationRef.canGoBack()) {
				navigationRef.goBack();
			}
		} else {
			// Android: clearing activeName tells SheetHost to dismiss.
			useSheetStore.getState().close();
		}
	}, []);

	return { openSheet, closeSheet };
};

export const useSheetParams = <Name extends SheetName>() =>
	useSheetStore(state => state.params) as SheetParams[Name];
