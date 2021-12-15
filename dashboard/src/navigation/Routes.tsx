import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, createClient, dedupExchange, cacheExchange } from 'urql';

import Overview from '../screens/Overview';
import Orders from '../screens/Orders';
import Order from '../screens/Order';
import Products from '../screens/Products';
import Product from '../screens/Product';
import Settings from '../screens/Settings';
import Register from '../screens/Register';
import Authenticate from '../screens/Authenticate';
import Verify from '../screens/Verify';
import Store from '../screens/Store';
import AddProduct from '../screens/AddProduct';
import EditProduct from '../screens/EditProduct';
import StoreSelect from '../screens/StoreSelect';
import CreateStore from '../screens/CreateStore';

import SettingsActiveStore from '../components/settings/SettingsActiveStore';
import { Icon, IconType } from '../components/icons';
import { useAppSelector } from '../redux/store';
import env from '../../env';
import { AppStackParamList } from '../types/navigation';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

// Navigation Structure
// - Auth (Stack Navigator)
//  - Authenticate
//  - Register
//  - Verify
// - Main (Tab Navigator)
//  - Overview
//  - Orders (Stack Navigator)
//   - OrdersList
//   - Order
//  - Products (Stack Navigator)
//   - ProductsList
//   - AddProduct
//   - Product
//   - EditProduct
//  - Store

// List of all screens that will be "modals"
// - Settings
// - Add/Edit Product (and most other form-based views)

const AppStack = createStackNavigator<AppStackParamList>();
const OrdersStack = createStackNavigator();
const ProductsStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const getIcon = (routeName: string): IconType => {
	switch (routeName) {
		case 'Overview':
			return 'home';
		case 'Products':
			return 'tag';
		case 'Orders':
			return 'inbox';
		case 'Store':
			return 'shoppingBag';
	}
	throw new Error('Specified route does not exist.');
};

const RootNavigator: React.FC = () => {
	const { accessToken, activeStore } = useAppSelector(
		({ auth, preferences }) => ({
			accessToken: auth.accessToken,
			activeStore: preferences.activeStore
		})
	);

	return (
		<AppStack.Navigator screenOptions={{ headerShown: false }}>
			{accessToken ? (
				<>
					{!activeStore ? (
						<>
							<AppStack.Screen name='StoreSelect' component={StoreSelect} />
							<AppStack.Screen name='CreateStore' component={CreateStore} />
						</>
					) : (
						<AppStack.Screen name='Main'>
							{() => (
								<MainTab.Navigator
									screenOptions={({ route }) => ({
										tabBarIcon: ({ color }) => (
											<Icon
												name={getIcon(route.name)}
												color={color}
												size={28}
											/>
										),
										tabBarActiveTintColor: 'black',
										tabBarInactiveTintColor: 'gray',
										tabBarShowLabel: false
									})}
								>
									<MainTab.Screen name='Overview' component={Overview} />
									<MainTab.Screen
										name='Orders'
										options={{ headerShown: false }}
									>
										{() => (
											<OrdersStack.Navigator>
												<OrdersStack.Screen
													name='OrdersList'
													component={Orders}
													options={{ title: 'Orders' }}
												/>
												<OrdersStack.Screen name='Order' component={Order} />
											</OrdersStack.Navigator>
										)}
									</MainTab.Screen>
									<MainTab.Screen
										name='Products'
										options={{ headerShown: false }}
									>
										{() => (
											<ProductsStack.Navigator>
												<ProductsStack.Screen
													name='ProductsList'
													component={Products}
													options={({ navigation }) => ({
														title: 'Products',
														headerRight: () => (
															<TouchableOpacity
																onPress={() =>
																	navigation.navigate('Add Product')
																}
																style={{ marginRight: 16 }}
															>
																<Icon name='plus' />
															</TouchableOpacity>
														)
													})}
												/>
												<ProductsStack.Screen
													name='Product'
													component={Product}
													options={() => ({
														title: '',
														headerBackTitleVisible: false,
														headerBackImage: () => (
															<Icon size={28} name='chevronLeft' />
														)
													})}
												/>
											</ProductsStack.Navigator>
										)}
									</MainTab.Screen>
									<MainTab.Screen name='Store' component={Store} />
								</MainTab.Navigator>
							)}
						</AppStack.Screen>
					)}
				</>
			) : (
				<>
					<AppStack.Screen name='Register' component={Register} />
					<AppStack.Screen name='Authenticate' component={Authenticate} />
					<AppStack.Screen name='Verify' component={Verify} />
				</>
			)}
		</AppStack.Navigator>
	);
};

const ModalsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const Routes: React.FC = () => {
	const { accessToken, activeStore } = useAppSelector(
		({ auth, preferences }) => ({
			accessToken: auth.accessToken,
			activeStore: preferences.activeStore
		})
	);

	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetchOptions: () => ({
					headers: {
						authorization: accessToken ? `Bearer ${accessToken}` : '',
						'x-market-store-id': activeStore || ''
					}
				}),
				exchanges: [dedupExchange, cacheExchange, multipartFetchExchange]
			}),
		[accessToken, activeStore]
	);

	return (
		<Provider value={client}>
			<NavigationContainer>
				<ModalsStack.Navigator>
					<ModalsStack.Screen name='Root' options={{ headerShown: false }}>
						{() => <RootNavigator />}
					</ModalsStack.Screen>
					<ModalsStack.Group screenOptions={{ presentation: 'modal' }}>
						<ModalsStack.Screen name='Add Product' component={AddProduct} />
						<ModalsStack.Screen name='Edit Product' component={EditProduct} />
						<ModalsStack.Screen
							name='SettingsStack'
							options={{ headerShown: false }}
						>
							{() => (
								<SettingsStack.Navigator>
									<SettingsStack.Screen name='Settings' component={Settings} />
									<SettingsStack.Screen
										name='SettingsActiveStore'
										component={SettingsActiveStore}
										options={{ title: 'Active Store' }}
									/>
								</SettingsStack.Navigator>
							)}
						</ModalsStack.Screen>
					</ModalsStack.Group>
				</ModalsStack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
