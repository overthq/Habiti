import { NavigatorScreenParams } from '@react-navigation/native';
import { IntWhere, ProductQuery, Sort } from './api';

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
	'Modals.EditCategory': { categoryId: string };
	AddManager: undefined;
	FilterProducts: undefined;
	FilterOrders: undefined;
	'Modal.CreateStore': undefined;
};

export type MainTabParamList = {
	Home: undefined;
	Orders: undefined;
	Products?: undefined;
	Store: undefined;
};

export type HomeStackParamList = {
	Overview: undefined;
	Payouts: undefined;
	Order: { orderId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type OrdersStackParamList = {
	OrdersList: OrdersParams;
	Order: { orderId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type ProductsStackParamList = {
	ProductsList: ProductsParams;
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
	Settings: undefined;
	Appearance: undefined;
};

// TODO: Use context for productId and other shared details if needed.
export type ProductStackParamList = {
	'Product.Main': { productId: string };
	'Product.Images': {
		productId: string;
		images: ProductQuery['product']['images'];
	};
	'Product.Categories': {
		productId: string;
		categories: ProductQuery['product']['categories'];
	};
	'Product.Details': { productId: string; name: string; description: string };
};

type ProductsParams = {
	filter?: {
		unitPrice?: IntWhere;
	};
	orderBy?: {
		createdAt?: Sort;
		updatedAt?: Sort;
		unitPrice?: Sort;
	}[];
};

type OrdersParams = {
	orderBy?: {
		createdAt?: Sort;
		updatedAt?: Sort;
	}[];
};
