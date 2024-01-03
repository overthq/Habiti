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
};

export type MainTabParamList = {
	Home: undefined;
	Orders: undefined;
	Products: undefined;
	Store: undefined;
};

export type HomeStackParamList = {
	Overview: undefined;
	Payouts: undefined;
	Order: { orderId: string };
	Product: { productId: string };
};

export type OrdersStackParamList = {
	OrdersList: undefined;
	Order: { orderId: string };
	Product: { productId: string };
};

export type ProductsStackParamList = {
	ProductsList: undefined;
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
