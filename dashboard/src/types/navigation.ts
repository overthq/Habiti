export type AppStackParamList = {
	Main: undefined;
	Authenticate: undefined;
	Register: undefined;
	Verify: { phone: string };
	StoreSelect: undefined;
	CreateStore: undefined;
	Root: undefined;
	'Add Product': undefined;
	'Edit Store': undefined;
	Settings: undefined;
	CustomerInfo: { userId: string };
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
	Product: { productId: string };
};

export type ProductsStackParamList = {
	ProductsList: undefined;
	Product: { productId: string };
	// SearchProducts: undefined;
};

export type SettingsStackParamList = {
	SettingsList: undefined;
	SettingsActiveStore: undefined;
	SettingsTheme: undefined;
};
