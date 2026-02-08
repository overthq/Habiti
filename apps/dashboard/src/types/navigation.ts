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
	AddManager: undefined;
	'Modal.CreateStore': undefined;
	'Modal.AddPayoutAccount': undefined;
	'Modal.Order': { orderId: string };
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
	// OrdersList: OrdersParams;
	OrdersList: undefined;
	Order: { orderId: string };
	Product: NavigatorScreenParams<ProductStackParamList>;
};

export type ProductsStackParamList = {
	// ProductsList: ProductsParams;
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
	Settings: undefined;
	Appearance: undefined;
};

// TODO: Use context for productId and other shared details if needed.
export type ProductStackParamList = {
	'Product.Main': { productId: string };
	'Product.Images': {
		productId: string;
		images: Image[];
	};
	'Product.Categories': {
		productId: string;
		categories: ProductCategory[];
	};
	'Product.Details': { productId: string; name: string; description: string };
};

// type ProductsParams = {
// 	filter?: {
// 		unitPrice?: IntWhere;
// 		categories?: CategoriesWhere;
// 	};
// 	orderBy?: {
// 		createdAt?: Sort;
// 		updatedAt?: Sort;
// 		unitPrice?: Sort;
// 	}[];
// };

// type OrdersParams = {
// 	orderBy?: {
// 		createdAt?: Sort;
// 		updatedAt?: Sort;
// 	}[];
// };
