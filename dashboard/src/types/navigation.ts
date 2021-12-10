export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Register: undefined;
	Verify: { phone: string };
	StoreSelect: undefined;
	CreateStore: undefined;
};

export type MainTabParamList = {
	Overview: undefined;
	Orders: undefined;
	Items: undefined;
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
	'Add Item': undefined;
	'Edit Item': { itemId: string };
	SettingsStack: undefined;
};

export type SettingsStackParamList = {
	[key: string]: undefined;
};
