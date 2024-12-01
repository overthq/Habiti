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
	'Modal.AddDeliveryAddress': undefined;
};

export type HomeStackParamList = {
	'Home.Main': undefined;
	'Home.Order': { orderId: string };
	'Home.Store': NavigatorScreenParams<StoreStackParamList>;
	'Home.Settings': undefined;
	'Home.SettingsTheme': undefined;
	'Home.Notifications': undefined;
};

export type ExploreStackParamList = {
	'Explore.Main': undefined;
	'Explore.Store': NavigatorScreenParams<StoreStackParamList>;
};

export type CartStackParamList = {
	'Carts.Main': undefined;
};

export type ProfileStackParamList = {
	'Profile.Main': undefined;
	'Profile.Edit': undefined;
	'Profile.PaymentMethods': undefined;
	'Profile.DeliveryAddress': undefined;
	'Profile.NotificationSettings': undefined;
	'Profile.Appearance': undefined;
	'Profile.AccountSettings': undefined;
};

// TODO: Create context for storeId (and store name) in this case.
export type StoreStackParamList = {
	'Store.Main': { storeId: string };
	'Store.Search': { storeId: string }; // Store name goes here
};

export type MainTabParamList = {
	'Main.ForYou': undefined;
	'Main.Explore': undefined;
	'Main.Carts': undefined;
	'Main.Profile': undefined;
};
