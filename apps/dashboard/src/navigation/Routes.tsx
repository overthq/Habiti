import React from 'react';
import { Icon, type IconType, themes, useTheme } from '@habiti/components';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useShallow } from 'zustand/react/shallow';
import * as Updates from 'expo-updates';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Authenticate from '../screens/Authenticate';
import Landing from '../screens/Landing';
import Register from '../screens/Register';
import Order from '../screens/Order';
import StoreSelect from '../screens/StoreSelect';
import Verify from '../screens/Verify';
import Product from '../screens/Product';
import Overview from '../screens/Overview';
import Payouts from '../screens/Payouts';
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
import AddPayoutAccount from '../screens/AddPayoutAccount';
import Appearance from '../screens/Appearance';
import Categories from '../screens/Categories';
import EditStore from '../screens/EditStore';
import Managers from '../screens/Managers';
import Store from '../screens/Store';
import StorePayouts from '../screens/StorePayouts';
import StoreSettings from '../screens/StoreSettings';
import Products from '../screens/Products';
import SearchProducts from '../screens/SearchProducts';

import useStore from '../state';

import {
	AppStackParamList,
	ProductStackParamList,
	HomeStackParamList,
	StoreStackParamList,
	MainTabParamList,
	OrdersStackParamList,
	ProductsStackParamList
} from '../types/navigation';

const AppStack = createNativeStackNavigator<AppStackParamList, 'AppStack'>();
const HomeStack = createNativeStackNavigator<HomeStackParamList, 'HomeStack'>();
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

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator initialRouteName='Overview' id='HomeStack'>
			<HomeStack.Screen
				name='Overview'
				component={Overview}
				options={{ headerShown: false }}
			/>
			<HomeStack.Screen name='Payouts' component={Payouts} />
			<HomeStack.Screen name='Order' component={Order} />
			<HomeStack.Screen
				name='Product'
				component={ProductStackNavigator}
				options={{ headerShown: false }}
			/>
		</HomeStack.Navigator>
	);
};

const icons: Record<keyof MainTabParamList, IconType> = {
	Home: 'home',
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shopping-bag'
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
			initialRouteName='Home'
		>
			<MainTab.Screen name='Home' component={HomeStackNavigator} />
			<MainTab.Screen name='Orders' component={OrdersStackNavigator} />
			<MainTab.Screen name='Products' component={ProductsStackNavigator} />
			<MainTab.Screen name='Store' component={StoreStackNavigator} />
		</MainTab.Navigator>
	);
};

const ProductStackNavigator = () => {
	return (
		<ProductStack.Navigator id='ProductStack'>
			<ProductStack.Screen
				name='Product.Main'
				component={Product}
				options={{
					headerTitle: 'Product'
				}}
			/>
			<ProductStack.Screen
				name='Product.Images'
				component={ProductImages}
				options={{ headerTitle: 'Media' }}
			/>
			<ProductStack.Screen
				name='Product.Categories'
				component={ProductCategories}
				options={{ headerTitle: 'Categories' }}
			/>
			<ProductStack.Screen
				name='Product.Details'
				component={ProductDetails}
				options={{ headerTitle: 'Product Details' }}
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
		<ProductsStack.Screen
			name='Products.Search'
			component={SearchProducts}
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
		<OrdersStack.Screen name='Order' component={Order} />
		<OrdersStack.Screen
			name='Product'
			component={ProductStackNavigator}
			options={{ headerShown: false }}
		/>
	</OrdersStack.Navigator>
);

const ModalGroup = (
	<AppStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
		<AppStack.Screen name='Add Product' component={AddProduct} />
		<AppStack.Screen
			name='CustomerInfo'
			component={CustomerInfo}
			options={{ headerTitle: 'Customer Information' }}
		/>
		<AppStack.Screen
			name='AddPayout'
			component={AddPayout}
			options={{ headerTitle: 'Add Payout' }}
		/>
		<AppStack.Screen
			name='AddCategory'
			component={AddCategory}
			options={{ headerTitle: 'Add Category' }}
		/>
		<AppStack.Screen
			name='Modals.EditCategory'
			component={EditCategory}
			options={{ headerTitle: 'Edit Category' }}
		/>
		<AppStack.Screen
			name='AddManager'
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
	</AppStack.Group>
);

const StoreStackNavigator = () => {
	return (
		<StoreStack.Navigator id='StoreStack' initialRouteName='StoreHome'>
			<StoreStack.Screen
				name='StoreHome'
				component={Store}
				options={{ headerShown: false }}
			/>
			<StoreStack.Screen name='Edit Store' component={EditStore} />
			<StoreStack.Screen name='Managers' component={Managers} />
			<StoreStack.Screen name='Payouts' component={StorePayouts} />
			<StoreStack.Screen name='Categories' component={Categories} />
			<StoreStack.Screen name='Settings' component={StoreSettings} />
			<StoreStack.Screen name='Appearance' component={Appearance} />
		</StoreStack.Navigator>
	);
};

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
		<NavigationContainer theme={theme.navigation}>
			<StatusBar style={theme.statusBar} />
			<AppStack.Navigator
				id='AppStack'
				initialRouteName={
					accessToken ? (!activeStore ? 'StoreSelect' : 'Main') : 'Landing'
				}
				screenOptions={{ headerShown: false }}
			>
				{accessToken ? (
					!activeStore ? (
						<AppStack.Group>
							<AppStack.Screen name='StoreSelect' component={StoreSelect} />
						</AppStack.Group>
					) : (
						<>
							<AppStack.Screen name='Main' component={MainTabNavigator} />
							{ModalGroup}
						</>
					)
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
