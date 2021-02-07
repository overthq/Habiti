export type AppStackParamList = {
	Main: undefined;
};

export type MainTabParamList = {
	Overview: undefined;
	Orders: undefined;
	Items: undefined;
	Store: undefined;
};

export type OverviewStackParamList = {
	Home: undefined;
	Settings: undefined;
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
	Item: { itemId: string }; // This is also a navigator in itself, how does that work?
};
