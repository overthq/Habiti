import type {
	CompositeScreenProps,
	NavigatorScreenParams
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AppStackParamList = {
	Landing: undefined;
	'App.Home': NavigatorScreenParams<HomeStackParamList>;
	'App.Profile': NavigatorScreenParams<ProfileStackParamList>;
	'App.Carts': undefined;
	Register: undefined;
	Authenticate: undefined;
	Verify: { email: string };
	Product: { productId: string };
	Reviews: { productId: string };
	Cart: { cartId: string };
	'Modal.AddCard': { orderId?: string };
	'Modal.AddAddress': undefined;
	'Modal.EditAddress': {
		addressId: string;
		name: string;
		line1: string;
		line2?: string;
		city: string;
		state: string;
		country: string;
		postcode?: string;
	};
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
	StackScreenProps<AppStackParamList, T>;

export type HomeStackParamList = {
	'Home.Main': undefined;
	'Home.Order': { orderId: string };
	'Home.Store': { storeId: string };
	'Home.Settings': undefined;
	'Home.SettingsTheme': undefined;
	'Home.Notifications': undefined;
	'Home.Search': undefined;
	'Home.Orders': undefined;
	'Home.FollowedStores': undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
	CompositeScreenProps<
		StackScreenProps<HomeStackParamList, T>,
		AppStackScreenProps<'App.Home'>
	>;

export type ProfileStackParamList = {
	'Profile.Main': undefined;
	'Profile.Edit': undefined;
	'Profile.PaymentMethods': undefined;
	'Profile.Addresses': undefined;
	'Profile.NotificationSettings': undefined;
	'Profile.Appearance': undefined;
	'Profile.AccountSettings': undefined;
};

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
	CompositeScreenProps<
		StackScreenProps<ProfileStackParamList, T>,
		AppStackScreenProps<'App.Profile'>
	>;

export type ExploreStackParamList = {
	'Explore.Main': undefined;
	'Explore.Store': NavigatorScreenParams<StoreStackParamList>;
};

export type ExploreStackScreenProps<T extends keyof ExploreStackParamList> =
	StackScreenProps<ExploreStackParamList, T>;

export type CartStackParamList = {
	'Carts.Main': undefined;
};

export type CartStackScreenProps<T extends keyof CartStackParamList> =
	StackScreenProps<CartStackParamList, T>;

export type StoreStackParamList = {
	'Store.Main': { storeId: string };
	'Store.Search': { storeId: string };
};

export type StoreStackScreenProps<T extends keyof StoreStackParamList> =
	StackScreenProps<StoreStackParamList, T>;

export type MainTabParamList = {
	'Main.ForYou': undefined;
	'Main.Carts': undefined;
	'Main.Profile': undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
	BottomTabScreenProps<MainTabParamList, T>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends AppStackParamList {}
	}
}
