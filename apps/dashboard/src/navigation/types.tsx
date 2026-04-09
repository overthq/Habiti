import type {
	CompositeScreenProps,
	NavigatorScreenParams
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Image, ProductCategory } from '../data/types';

export type AppStackParamList = {
	Main: NavigatorScreenParams<MainTabParamList>;
	Authenticate: undefined;
	Landing: undefined;
	Register: undefined;
	Verify: { email: string };
	StoreSelect: undefined;
	Root: undefined;
	Settings: undefined;

	'Modal.CreateStore': undefined;
	'Modal.AddProduct': undefined;
	'Modal.AddPayout': { realizedRevenue: number; paidOut: number };
	'Modal.AddCategory': undefined;
	'Modal.EditCategory': {
		categoryId: string;
		name: string;
		description: string;
	};
	'Modal.AddAddress': undefined;
	'Modal.EditAddress': {
		addressId: string;
		name: string;
		line1: string;
		line2?: string;
		city: string;
		state: string;
		country: string;
		postcode?: string;
	};
	'Modal.AddManager': undefined;
	'Modal.AddPayoutAccount': undefined;
	'Modal.Order': { orderId: string };
	'Modal.EditProductDetails': {
		productId: string;
		name: string;
		description: string;
	};
	'Modal.EditProductImages': { productId: string; images: Image[] };
	'Modal.EditProductCategories': {
		productId: string;
		categories: ProductCategory[];
	};
	'Modal.Transactions': undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
	StackScreenProps<AppStackParamList, T>;

export type MainTabParamList = {
	Orders: NavigatorScreenParams<OrdersStackParamList>;
	Products: NavigatorScreenParams<ProductsStackParamList>;
	Store: NavigatorScreenParams<StoreStackParamList>;
	Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<MainTabParamList, T>,
		AppStackScreenProps<'Main'>
	>;

export type OrdersStackScreenProps<T extends keyof OrdersStackParamList> =
	CompositeScreenProps<
		StackScreenProps<OrdersStackParamList, T>,
		MainTabScreenProps<'Orders'>
	>;

export type ProductsStackScreenProps<T extends keyof ProductsStackParamList> =
	CompositeScreenProps<
		StackScreenProps<ProductsStackParamList, T>,
		MainTabScreenProps<'Products'>
	>;

export type StoreStackScreenProps<T extends keyof StoreStackParamList> =
	CompositeScreenProps<
		StackScreenProps<StoreStackParamList, T>,
		MainTabScreenProps<'Store'>
	>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
	CompositeScreenProps<
		StackScreenProps<ProfileStackParamList, T>,
		MainTabScreenProps<'Profile'>
	>;

export type OrdersStackParamList = {
	OrdersList: undefined;
	Order: { orderId: string };
	CustomerInfo: { userId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type ProductsStackParamList = {
	ProductsList: undefined;
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type StoreStackParamList = {
	StoreHome: undefined;
	StoreSettings: undefined;
	'Edit Store': undefined;
	BalanceDetails: undefined;
	Payouts: undefined;
	Managers: undefined;
	Categories: undefined;
	Addresses: undefined;
	Settings: undefined;
	Transactions: undefined;
	Transaction: { transactionId: string };
};

export type ProfileStackParamList = {
	ProfileHome: undefined;
	Appearance: undefined;
	ManageAccount: undefined;
};

export type ProductStackParamList = {
	'Product.Main': { productId: string };
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends AppStackParamList {}
	}
}
