export type AppStackParamList = {
	Home: undefined;
	Store: { storeId: string };
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Product: { productId: string; storeId: string };
	Cart: { cartId: string };
	Order: { orderId: string };
	'Edit Profile': undefined;
	'Add Card': undefined;
	'Payment Methods': undefined;
};

export type HomeTabParamList = {
	'For You': undefined;
	Explore: undefined;
	Carts: undefined;
	Profile: undefined;
};
