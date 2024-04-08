import { NavigatorScreenParams } from '@react-navigation/native';

export type AppStackParamList = {
	Home: undefined;
	Store: NavigatorScreenParams<StoreStackParamList>;
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Product: { productId: string };
	Cart: { cartId: string };
	'Add Card': undefined;
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
	Store: NavigatorScreenParams<StoreStackParamList>;
};

export type CartStackParamList = {
	'Carts.Main': undefined;
};

export type ProfileStackParamList = {
	'Profile.Main': undefined;
	'Edit Profile': undefined;
	'Payment Methods': undefined;
	DeliveryAddress: undefined;
	NotificationSettings: undefined;
	Appearance: undefined;
};

// TODO: Create context for storeId (and store name) in this case.
export type StoreStackParamList = {
	'Store.Main': { storeId: string };
	'Store.Search': { storeId: string }; // Store name goes here
};

export type HomeTabParamList = {
	'For You': undefined;
	Explore: undefined;
	Carts: undefined;
	Profile: undefined;
};
