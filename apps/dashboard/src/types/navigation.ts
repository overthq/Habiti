import { NavigatorScreenParams } from '@react-navigation/native';
import { Image, ProductCategory } from '../data/types';

export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Landing: undefined;
	Register: undefined;
	Verify: { email: string };
	StoreSelect: undefined;
	'Modal.CreateStore': undefined;
	Root: undefined;
	'Add Product': undefined;
	Settings: undefined;
	'Modal.CustomerInfo': { userId: string };
	'Modal.AddPayout': undefined;
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
