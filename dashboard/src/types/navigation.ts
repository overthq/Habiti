// Navigation Structure
// - Auth (Stack Navigator)
//  - Authenticate
//  - Register
//  - Verify
// - Main (Tab Navigator)
//  - Overview
//  - Orders (Stack Navigator)
//   - OrdersList
//   - Order
//  - Products (Stack Navigator)
//   - ProductsList
//   - AddProduct
//   - Product
//   - EditProduct
//  - Store

export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Register: undefined;
	Verify: { phone: string };
	StoreSelect: undefined;
	CreateStore: undefined;

	Root: undefined;
	'Add Product': undefined;
	'Edit Product': { productId: string };
	SettingsStack: undefined;
};

export type MainTabParamList = {
	Overview: undefined;
	Orders: undefined;
	Products: undefined;
	Store: undefined;
};

export type ProductStackParamList = {
	ProductDetail: { itemId: string };
	AddProduct: undefined;
	EditProduct: { itemId: string };
};

export type OrdersStackParamsList = {
	OrdersList: undefined;
	Order: { orderId: string };
};

export type ProductsStackParamList = {
	ProductsList: undefined;
	Product: { productId: string };
};

export type ModalStackParamList = {
	Root: undefined;
	'Add Product': undefined;
	'Edit Product': { productId: string };
	SettingsStack: undefined;
};

export type SettingsStackParamList = {
	[key: string]: undefined;
};
