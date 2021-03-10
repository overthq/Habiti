export type AppStackParamList = {
	Main: undefined;
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
	Item: { itemId: string }; // This is also a navigator in itself, how does that work?
};

export type ModalStackParamList = {
	'Add Item': undefined;
	'Edit Item': { itemId: string };
};
