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
	Settings: undefined;
};

export type MainTabParamList = {
	Overview: undefined;
	Orders: undefined;
	Products: undefined;
	Store: undefined;
};

export type OrdersStackParamsList = {
	OrdersList: undefined;
	Order: { orderId: string };
};

export type ProductsStackParamList = {
	ProductsList: undefined;
	Product: { productId: string };
};

export type SettingsStackParamList = {
	[key: string]: undefined;
};
