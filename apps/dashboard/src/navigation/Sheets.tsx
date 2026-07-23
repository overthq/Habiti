import React from 'react';
import { Platform, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomModal } from '@habiti/components';
import type { ThemeObject } from '@habiti/components/src/styles/theme';

import {
	registerResolver,
	resolveRequest,
	useSheetStore
} from '../state/sheet';
import { navigationRef } from './utils';
import ProductMenuModal from '../components/product/ProductMenuModal';
import ProductPriceModal from '../components/modals/ProductPriceModal';
import ProductInventoryModal from '../components/modals/ProductInventoryModal';
import StoreSelectModal from '../components/store/StoreSelectModal';
import ProductsFilterModal from '../components/products/ProductsFilterModal';
import OrdersFilterModal from '../components/orders/OrdersFilterModal';

import type { AppStackParamList } from './types';

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

interface SheetConfig {
	Content: React.ComponentType;
	ios: {
		detents: number[] | 'fitToContents';
		initialIndex?: number;
	};
	android: {
		snapPoints?: (string | number)[];
	};
}

const sheetRegistry: Record<SheetName, SheetConfig> = {
	productMenu: {
		Content: ProductMenuModal,
		ios: { detents: 'fitToContents' },
		android: {}
	},
	productPrice: {
		Content: ProductPriceModal,
		ios: { detents: 'fitToContents' },
		android: {}
	},
	productInventory: {
		Content: ProductInventoryModal,
		ios: { detents: 'fitToContents' },
		android: {}
	},
	storeSelect: {
		Content: StoreSelectModal,
		ios: { detents: 'fitToContents' },
		android: {}
	},
	productsFilter: {
		Content: ProductsFilterModal,
		ios: { detents: 'fitToContents' },
		android: {}
	},
	ordersFilter: {
		Content: OrdersFilterModal,
		ios: { detents: 'fitToContents' },
		android: {}
	}
};

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

export const SheetHost = () => {
	const modalRef = React.useRef<BottomSheetModal>(null);
	const activeName = useSheetStore(state => state.activeName);
	const rendered = useSheetStore(state => state.rendered);
	const requestId = useSheetStore(state => state.requestId);
	const requestIdRef = React.useRef<number | null>(null);

	React.useEffect(() => {
		if (rendered) {
			requestIdRef.current = requestId;
			modalRef.current?.present();
		}
	}, [requestId, rendered]);

	React.useEffect(() => {
		if (!activeName && rendered) {
			modalRef.current?.dismiss();
		}
	}, [activeName, rendered]);

	const handleDismiss = React.useCallback(() => {
		if (requestIdRef.current !== null) {
			resolveRequest(requestIdRef.current, undefined);
			requestIdRef.current = null;
		}

		useSheetStore.getState().finishDismiss();
	}, []);

	const config = rendered ? sheetRegistry[rendered] : null;
	const Content = config?.Content;

	return (
		<BottomModal
			modalRef={modalRef}
			onDismiss={handleDismiss}
			{...(config?.android.snapPoints
				? { snapPoints: config.android.snapPoints }
				: { enableDynamicSizing: true })}
		>
			{Content ? <Content /> : null}
		</BottomModal>
	);
};

type AppStackNavigator = ReturnType<
	typeof createNativeStackNavigator<AppStackParamList, 'AppStack'>
>;

const SheetScreenContainer: React.FC<{ name: SheetName }> = ({ name }) => {
	const requestId = React.useRef(useSheetStore.getState().requestId).current;

	React.useEffect(() => {
		return () => {
			resolveRequest(requestId, undefined);
		};
	}, [requestId]);

	const { Content, ios } = sheetRegistry[name];
	// Top padding clears the native grabber (Android's gorhom handle already
	// reserves this space). Kept inside the measured content so it counts toward
	// fitToContents. flex:1 only for detent-sized sheets so their scroll lists
	// fill the sheet — a flex:1 root would defeat fitToContents measurement.
	const fill = ios.detents !== 'fitToContents';

	return (
		<View style={{ paddingTop: 16, flex: fill ? 1 : undefined }}>
			<Content />
		</View>
	);
};

const SHEET_NAMES = Object.keys(sheetRegistry) as SheetName[];

export const createSheetScreens = (
	Stack: AppStackNavigator,
	theme: ThemeObject
) =>
	SHEET_NAMES.map(name => {
		const { ios } = sheetRegistry[name];

		return (
			<Stack.Screen
				key={name}
				name={SHEET_ROUTE_NAMES[name]}
				options={{
					presentation: 'formSheet',
					headerShown: false,
					contentStyle: { backgroundColor: theme.modal.background },
					sheetAllowedDetents: ios.detents,
					sheetInitialDetentIndex: ios.initialIndex,
					sheetGrabberVisible: true,
					sheetCornerRadius: 16
				}}
			>
				{() => <SheetScreenContainer name={name} />}
			</Stack.Screen>
		);
	});
