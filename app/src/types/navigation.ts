export type AppStackParamList = {
	Main: undefined;
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Item: { itemId: string };
	Cart: { cartId: string };
	Order: { orderId: string };
};

export type MainStackParamList = {
	Home: undefined;
	Store: { storeId: string };
};

export type HomeTabParamList = {
	'For You': undefined;
	Explore: undefined;
	Carts: undefined;
	Profile: undefined;
};

// FIXME: Change this when actual route names are known.
export type SettingsStackParamList = {
	[key: string]: undefined;
};
