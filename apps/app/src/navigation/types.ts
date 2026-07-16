import type {
	CompositeScreenProps,
	NavigatorScreenParams
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AppStackParamList = {
	Landing: undefined;
	'App.Main': NavigatorScreenParams<MainTabParamList>;
	Product: { productId: string };
	Cart: { cartId: string };
	'Modal.Auth': NavigatorScreenParams<AuthStackParamList> | undefined;
	'Modal.AddCard': { orderId?: string };
	'Modal.AddAddress': undefined;
	'Modal.StoreInfo': { storeId: string };
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
	NativeStackScreenProps<AppStackParamList, T>;

export type AuthStackParamList = {
	'Auth.Main': undefined;
	'Auth.Register': undefined;
	'Auth.Verify': { email: string };
};

/**
 * The screens the auth modal can be opened at. Verification is only reachable
 * from within the flow, since it needs an email to verify.
 */
export type AuthEntryScreen = Exclude<keyof AuthStackParamList, 'Auth.Verify'>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<AuthStackParamList, T>,
		AppStackScreenProps<'Modal.Auth'>
	>;

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
		NativeStackScreenProps<HomeStackParamList, T>,
		MainTabScreenProps<'Main.Home'>
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
		NativeStackScreenProps<ProfileStackParamList, T>,
		MainTabScreenProps<'Main.Profile'>
	>;

export type ExploreStackParamList = {
	'Explore.Main': undefined;
	'Explore.Store': NavigatorScreenParams<StoreStackParamList>;
};

export type ExploreStackScreenProps<T extends keyof ExploreStackParamList> =
	NativeStackScreenProps<ExploreStackParamList, T>;

export type CartStackParamList = {
	'Carts.Main': undefined;
};

export type CartStackScreenProps<T extends keyof CartStackParamList> =
	NativeStackScreenProps<CartStackParamList, T>;

export type StoreStackParamList = {
	'Store.Main': { storeId: string };
	'Store.Search': { storeId: string };
};

export type StoreStackScreenProps<T extends keyof StoreStackParamList> =
	NativeStackScreenProps<StoreStackParamList, T>;

export type MainTabParamList = {
	'Main.Home': NavigatorScreenParams<HomeStackParamList>;
	'Main.Carts': undefined;
	'Main.Profile': NavigatorScreenParams<ProfileStackParamList>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<MainTabParamList, T>,
		AppStackScreenProps<'App.Main'>
	>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends AppStackParamList {}
	}
}
