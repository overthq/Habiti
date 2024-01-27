import { IntWhere, Sort } from './api';

export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Register: undefined;
	Verify: { phone: string };
	StoreSelect: undefined;
	CreateStore: undefined;
	Root: undefined;
	'Add Product': undefined;
	Settings: undefined;
	CustomerInfo: { userId: string };
	AddPayout: undefined;
	AddCategory: undefined;
	AddManager: undefined;
	FilterProducts: undefined;
	FilterOrders: undefined;
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
	Product: { productId: string };
};

export type OrdersStackParamList = {
	OrdersList: OrdersParams;
	Order: { orderId: string };
	Product: { productId: string };
};

export type ProductsStackParamList = {
	ProductsList: ProductsParams;
	Product: { productId: string };
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
