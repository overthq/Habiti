import React from 'react';
import { Icon, type IconType, themes, useTheme } from '@habiti/components';
import {
	LinkingOptions,
	NavigationContainer,
	RouteProp
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useShallow } from 'zustand/react/shallow';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Authenticate from '../screens/Authenticate';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import Order from '../screens/Order';
import StoreSelect from '../screens/StoreSelect';
import Verify from '../screens/Verify';
import Product from '../screens/Product';
import ProductCategories from '../screens/ProductCategories';
import ProductImages from '../screens/ProductImages';
import ProductDetails from '../screens/ProductDetails';
import Orders from '../screens/Orders';
import AddCategory from '../screens/AddCategory';
import AddManager from '../screens/AddManager';
import AddPayout from '../screens/AddPayout';
import AddProduct from '../screens/AddProduct';
import CreateStore from '../screens/CreateStore';
import CustomerInfo from '../screens/CustomerInfo';
import EditCategory from '../screens/EditCategory';
import Addresses from '../screens/Addresses';
import AddAddress from '../screens/AddAddress';
import EditAddress from '../screens/EditAddress';
import AddPayoutAccount from '../screens/AddPayoutAccount';
import Appearance from '../screens/Appearance';
import ManageAccount from '../screens/ManageAccount';
import Categories from '../screens/Categories';
import EditStore from '../screens/EditStore';
import Managers from '../screens/Managers';
import Store from '../screens/Store';
import StorePayouts from '../screens/StorePayouts';
import Transactions from '../screens/Transactions';
import Transaction from '../screens/Transaction';
import BalanceDetails from '../screens/BalanceDetails';
import DeleteStore from '../screens/DeleteStore';
import StoreSettingsMenu from '../screens/StoreSettingsMenu';
import Profile from '../screens/Profile';
import Products from '../screens/Products';

import useStore from '../state';

import {
	AppStackParamList,
	ProductStackParamList,
	StoreStackParamList,
	MainTabParamList,
	OrdersStackParamList,
	ProductsStackParamList,
	ProfileStackParamList
} from '../navigation/types';
import { Linking } from 'react-native';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true
	})
});

const linking: LinkingOptions<AppStackParamList> = {
	prefixes: ['habiti-dashboard://'],
	config: {
		screens: {
			Main: {
				screens: {
					Orders: {
						screens: {
							OrdersList: 'orders',
							Order: 'orders/:orderId'
						}
					},
					Products: {
						screens: {
							ProductsList: 'products',
							Product: {
								screens: {
									'Product.Main': 'products/:productId'
								}
							}
						}
					},
					Store: {
						screens: {
							StoreHome: 'store',
							Payouts: 'store/payouts',
							Transactions: 'store/transactions',
							Transaction: 'store/transactions/:transactionId'
						}
					}
				}
			}
		}
	},
	async getInitialURL() {
		const url = await Linking.getInitialURL();

		if (url != null) {
			return url;
		}

		const response = Notifications.getLastNotificationResponse();

		return (
			(response?.notification.request.content.data.url as string) ?? undefined
		);
	},
	subscribe(listener) {
		const onReceiveURL = ({ url }: { url: string }) => listener(url);

		const eventListenerSubscription = Linking.addEventListener(
			'url',
			onReceiveURL
		);

		const subscription = Notifications.addNotificationResponseReceivedListener(
			response => {
				const url = response.notification.request.content.data.url;

				if (typeof url === 'string') {
					listener(url);
				}
			}
		);

		return () => {
			eventListenerSubscription.remove();
			subscription.remove();
		};
	}
};

const AppStack = createNativeStackNavigator<AppStackParamList, 'AppStack'>();
const MainTab = createBottomTabNavigator<MainTabParamList, 'MainTab'>();
const ProductStack = createNativeStackNavigator<
	ProductStackParamList,
	'ProductStack'
>();
const ProductsStack = createNativeStackNavigator<
	ProductsStackParamList,
	'ProductsStack'
>();
const OrdersStack = createNativeStackNavigator<
	OrdersStackParamList,
	'OrdersStack'
>();
const StoreStack = createNativeStackNavigator<
	StoreStackParamList,
	'StoreStack'
>();
const ProfileStack = createNativeStackNavigator<
	ProfileStackParamList,
	'ProfileStack'
>();

const icons: Record<keyof MainTabParamList, IconType> = {
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shopping-bag',
	Profile: 'user'
};

export const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<MainTabParamList> }) => ({
		headerShown: false,
		tabBarActiveTintColor: themes[themeName].text.primary,
		tabBarInactiveTintColor: themes[themeName].text.tertiary,
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={icons[route.name]} color={color} size={28} />
		),
		tabBarStyle: {
			paddingTop: 8
		}
	});

const MainTabNavigator = () => {
	const { name } = useTheme();

	return (
		<MainTab.Navigator
			id='MainTab'
			screenOptions={tabScreenOptions(name)}
			initialRouteName='Orders'
		>
			<MainTab.Screen name='Orders' component={OrdersStackNavigator} />
			<MainTab.Screen name='Products' component={ProductsStackNavigator} />
			<MainTab.Screen name='Store' component={StoreStackNavigator} />
			<MainTab.Screen name='Profile' component={ProfileStackNavigator} />
		</MainTab.Navigator>
	);
};

const ProductStackNavigator = () => {
	return (
		<ProductStack.Navigator id='ProductStack'>
			<ProductStack.Screen
				name='Product.Main'
				component={Product}
				options={({ navigation }) => ({
					headerTitle: 'Product',
					headerBackButtonDisplayMode: 'minimal',
					unstable_headerLeftItems: () => [
						{
							type: 'button',
							label: 'Back',
							icon: { type: 'sfSymbol', name: 'chevron.left' },
							onPress: () => {
								navigation.getParent()?.goBack();
							}
						}
					]
				})}
			/>
		</ProductStack.Navigator>
	);
};

const ProductsStackNavigator = () => (
	<ProductsStack.Navigator id='ProductsStack' initialRouteName='ProductsList'>
		<ProductsStack.Screen
			name='ProductsList'
			component={Products}
			options={{ headerShown: false }}
		/>
		<ProductsStack.Screen
			name='Product'
			component={ProductStackNavigator}
			options={{ headerShown: false }}
		/>
	</ProductsStack.Navigator>
);

const OrdersStackNavigator = () => (
	<OrdersStack.Navigator id='OrdersStack' initialRouteName='OrdersList'>
		<OrdersStack.Screen
			name='OrdersList'
			component={Orders}
			options={{ headerShown: false }}
		/>
		<OrdersStack.Screen
			name='Order'
			component={Order}
			options={{ headerBackButtonDisplayMode: 'minimal' }}
		/>
		<OrdersStack.Screen
			name='CustomerInfo'
			component={CustomerInfo}
			options={{
				headerTitle: 'Customer Information',
				headerBackButtonDisplayMode: 'minimal'
			}}
		/>
		<OrdersStack.Screen
			name='Product'
			component={ProductStackNavigator}
			options={{ headerShown: false }}
		/>
	</OrdersStack.Navigator>
);

const StoreStackNavigator = () => {
	return (
		<StoreStack.Navigator id='StoreStack' initialRouteName='StoreHome'>
			<StoreStack.Screen
				name='StoreHome'
				component={Store}
				options={{ headerShown: false }}
			/>
			<StoreStack.Screen
				name='StoreSettings'
				component={StoreSettingsMenu}
				options={{
					headerBackButtonDisplayMode: 'minimal',
					headerTitle: 'Store Settings'
				}}
			/>
			<StoreStack.Screen
				name='BalanceDetails'
				component={BalanceDetails}
				options={{
					headerBackButtonDisplayMode: 'minimal',
					headerTitle: 'Balance Details'
				}}
			/>
			<StoreStack.Screen
				name='Edit Store'
				component={EditStore}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='Managers'
				component={Managers}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='Payouts'
				component={StorePayouts}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='Categories'
				component={Categories}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='Addresses'
				component={Addresses}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='DeleteStore'
				component={DeleteStore}
				options={{
					headerBackButtonDisplayMode: 'minimal',
					headerTitle: 'Delete Store'
				}}
			/>
			<StoreStack.Screen
				name='Transactions'
				component={Transactions}
				options={{ headerBackButtonDisplayMode: 'minimal' }}
			/>
			<StoreStack.Screen
				name='Transaction'
				component={Transaction}
				options={{
					headerBackButtonDisplayMode: 'minimal',
					headerTitle: 'Transaction'
				}}
			/>
		</StoreStack.Navigator>
	);
};

const ProfileStackNavigator = () => (
	<ProfileStack.Navigator id='ProfileStack' initialRouteName='ProfileHome'>
		<ProfileStack.Screen
			name='ProfileHome'
			component={Profile}
			options={{ headerShown: false }}
		/>
		<ProfileStack.Screen
			name='Appearance'
			component={Appearance}
			options={{ headerBackButtonDisplayMode: 'minimal' }}
		/>
		<ProfileStack.Screen
			name='ManageAccount'
			component={ManageAccount}
			options={{
				headerBackButtonDisplayMode: 'minimal',
				headerTitle: 'Manage Account'
			}}
		/>
	</ProfileStack.Navigator>
);

const Routes: React.FC = () => {
	const { isUpdatePending } = Updates.useUpdates();

	React.useEffect(() => {
		if (isUpdatePending) {
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

	const { theme } = useTheme();
	const { accessToken, activeStore } = useStore(
		useShallow(state => ({
			accessToken: state.accessToken,
			activeStore: state.activeStore
		}))
	);

	return (
		<NavigationContainer theme={theme.navigation} linking={linking}>
			<StatusBar style={theme.statusBar} />
			<AppStack.Navigator
				id='AppStack'
				initialRouteName={
					accessToken ? (!activeStore ? 'StoreSelect' : 'Main') : 'Landing'
				}
				screenOptions={{ headerShown: false }}
			>
				{accessToken ? (
					<>
						{activeStore ? (
							<AppStack.Screen name='Main' component={MainTabNavigator} />
						) : (
							<AppStack.Screen name='StoreSelect' component={StoreSelect} />
						)}
						<AppStack.Group
							screenOptions={({ navigation }) => ({
								presentation: 'modal',
								headerShown: true,
								headerBackButtonDisplayMode: 'minimal',
								unstable_headerLeftItems: () => [
									{
										type: 'button',
										label: 'Back',
										icon: { type: 'sfSymbol', name: 'xmark' },
										onPress: navigation.goBack
									}
								]
							})}
						>
							<AppStack.Screen
								name='Modal.AddProduct'
								component={AddProduct}
								options={{ headerTitle: 'Add Product' }}
							/>
							<AppStack.Screen
								name='Modal.AddPayout'
								component={AddPayout}
								options={{ headerTitle: 'Add Payout' }}
							/>
							<AppStack.Screen
								name='Modal.AddCategory'
								component={AddCategory}
								options={{ headerTitle: 'Add Category' }}
							/>
							<AppStack.Screen
								name='Modal.EditCategory'
								component={EditCategory}
								options={{ headerTitle: 'Edit Category' }}
							/>
							<AppStack.Screen
								name='Modal.AddAddress'
								component={AddAddress}
								options={{ headerTitle: 'Add Address' }}
							/>
							<AppStack.Screen
								name='Modal.EditAddress'
								component={EditAddress}
								options={{ headerTitle: 'Edit Address' }}
							/>
							<AppStack.Screen
								name='Modal.AddManager'
								component={AddManager}
								options={{ headerTitle: 'Add Manager' }}
							/>
							<AppStack.Screen
								name='Modal.CreateStore'
								component={CreateStore}
								options={{ headerTitle: 'Create Store' }}
							/>
							<AppStack.Screen
								name='Modal.AddPayoutAccount'
								component={AddPayoutAccount}
								options={{ headerTitle: 'Add Payout Account' }}
							/>
							<AppStack.Screen
								name='Modal.Order'
								component={Order}
								options={{ headerTitle: 'Order' }}
							/>
							<AppStack.Screen
								name='Modal.EditProductDetails'
								component={ProductDetails}
								options={{ headerTitle: 'Product Details' }}
							/>
							<AppStack.Screen
								name='Modal.EditProductImages'
								component={ProductImages}
								options={{ headerTitle: 'Media' }}
							/>
							<AppStack.Screen
								name='Modal.EditProductCategories'
								component={ProductCategories}
								options={{ headerTitle: 'Categories' }}
							/>
							<AppStack.Screen
								name='Modal.Transactions'
								component={Transactions}
								options={{ headerTitle: 'Transactions' }}
							/>
						</AppStack.Group>
					</>
				) : (
					<AppStack.Group>
						<AppStack.Screen name='Landing' component={Landing} />
						<AppStack.Screen name='Register' component={Register} />
						<AppStack.Screen name='Authenticate' component={Authenticate} />
						<AppStack.Screen name='Verify' component={Verify} />
					</AppStack.Group>
				)}
			</AppStack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
