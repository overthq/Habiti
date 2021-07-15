export type AppStackParamList = {
	Main: undefined;
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Search: undefined;
	Item: { itemId: string };
	Cart: { cartId: string };
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
