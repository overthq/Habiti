import { NavigatorScreenParams } from '@react-navigation/native';
import { Image, ProductCategory } from '../data/types';

export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Landing: undefined;
	Register: undefined;
	Verify: { email: string };
	StoreSelect: undefined;
	CreateStore: undefined;
	Root: undefined;
	'Add Product': undefined;
	Settings: undefined;
	CustomerInfo: { userId: string };
	AddPayout: undefined;
	AddCategory: undefined;
	'Modals.EditCategory': {
		categoryId: string;
		name: string;
		description: string;
	};
	AddAddress: undefined;
	'Modals.EditAddress': {
		addressId: string;
		name: string;
		line1: string;
		line2?: string;
		city: string;
		state: string;
		country: string;
		postcode?: string;
	};
	AddManager: undefined;
	'Modal.CreateStore': undefined;
	'Modal.AddPayoutAccount': undefined;
	'Modal.Order': { orderId: string };
	'Modals.EditProductDetails': {
		productId: string;
		name: string;
		description: string;
	};
	'Modals.EditProductImages': { productId: string; images: Image[] };
	'Modals.EditProductCategories': {
		productId: string;
		categories: ProductCategory[];
	};
};

export type MainTabParamList = {
	Orders: undefined;
	Products: undefined;
	Payouts: undefined;
	Store: undefined;
};

export type HomeStackParamList = {
	Overview: undefined;
	Payouts: undefined;
	Order: { orderId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type OrdersStackParamList = {
	OrdersList: undefined;
	Order: { orderId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type ProductsStackParamList = {
	ProductsList: undefined;
	'Products.Search': undefined;
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type SettingsStackParamList = {
	SettingsList: undefined;
	SettingsActiveStore: undefined;
	SettingsTheme: undefined;
};

export type StoreStackParamList = {
	StoreHome: undefined;
	'Edit Store': undefined;
	Payouts: undefined;
	Managers: undefined;
	Categories: undefined;
	Addresses: undefined;
	Settings: undefined;
	Appearance: undefined;
};

// TODO: Use context for productId and other shared details if needed.
export type ProductStackParamList = {
	'Product.Main': { productId: string };
};
