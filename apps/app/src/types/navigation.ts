export type AppStackParamList = {
	Home: undefined;
	Store: { storeId: string };
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Product: { productId: string };
	Cart: { cartId: string };
	Order: { orderId: string };
	'Edit Profile': undefined;
	'Add Card': undefined;
	'Payment Methods': undefined;
};

export type HomeStackParamList = {
	Home: undefined;
	Order: { orderId: string };
	Store: { storeId: string };
	Settings: undefined;
	SettingsTheme: undefined;
};

export type ExploreStackParamList = {
	'Explore.Main': undefined;
	Store: { storeId: string };
	SearchStore: { storeId: string }; // TODO: Add store name
};

export type CartStackParamList = {
	'Carts.Main': undefined;
};

export type ProfileStackParamList = {
	'Profile.Main': undefined;
	'Edit Profile': undefined;
	'Payment Methods': undefined;
};

export type HomeTabParamList = {
	'For You': undefined;
	Explore: undefined;
	Carts: undefined;
	Profile: undefined;
};
