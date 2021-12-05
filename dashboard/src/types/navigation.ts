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

export type ItemStackParamList = {
	ItemDetail: { itemId: string };
	AddItem: undefined;
	EditItem: { itemId: string };
};

export type OrdersStackParamsList = {
	OrdersList: undefined;
	Order: { orderId: string };
};

export type ItemsStackParamList = {
	ItemsList: undefined;
	Item: { itemId: string };
};

export type ModalStackParamList = {
	'Add Item': undefined;
	'Edit Item': { itemId: string };
	SettingsStack: undefined;
};

export type SettingsStackParamList = {
	[key: string]: undefined;
};
