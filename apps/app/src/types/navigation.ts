import { NavigatorScreenParams } from '@react-navigation/native';

export type AppStackParamList = {
	Landing: undefined;
	Main: undefined;
	Register: undefined;
	Authenticate: undefined;
	Verify: { email: string };
	Product: { productId: string };
	Cart: { cartId: string };
	'Add Card': undefined;
};

export type HomeStackParamList = {
	Home: undefined;
	Order: { orderId: string };
	Store: NavigatorScreenParams<StoreStackParamList>;
	Settings: undefined;
	SettingsTheme: undefined;
	Notifications: undefined;
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
	'Profile.AccountSettings': undefined;
};

// TODO: Create context for storeId (and store name) in this case.
export type StoreStackParamList = {
	'Store.Main': { storeId: string };
	'Store.Search': { storeId: string }; // Store name goes here
};

export type MainTabParamList = {
	'For You': undefined;
	Explore: undefined;
	Carts: undefined;
	Profile: undefined;
};
