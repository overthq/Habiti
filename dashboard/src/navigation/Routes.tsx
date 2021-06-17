import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, createClient } from 'urql';

import Overview from '../screens/Overview';
import Orders from '../screens/Orders';
import Order from '../screens/Order';
import Items from '../screens/Items';
import Item from '../screens/Item';
import Settings from '../screens/Settings';
import Register from '../screens/Register';
import Authenticate from '../screens/Authenticate';
import Verify from '../screens/Verify';
import Store from '../screens/Store';
import AddItem from '../screens/AddItem';
import EditItem from '../screens/EditItem';
import StoreSelect from '../screens/StoreSelect';
import CreateStore from '../screens/CreateStore';

import SettingsActiveStore from '../components/settings/SettingsActiveStore';
import { Icon, IconType } from '../components/icons';
import { useAppSelector } from '../redux/store';
import env from '../../env';

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
//  - Items (Stack Navigator)
//   - ItemsList
//   - AddItem
//   - Item
//    - EditItem
//  - Store

// List of all screens that will be "modals"
// - Settings
// - Add/Edit Item (and most other form-based views)

const AppStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const getIcon = (routeName: string): IconType => {
	switch (routeName) {
		case 'Overview':
			return 'home';
		case 'Items':
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
									<MainTab.Screen name='Items' options={{ headerShown: false }}>
										{() => (
											<ItemsStack.Navigator>
												<ItemsStack.Screen
													name='ItemsList'
													component={Items}
													options={({ navigation }) => ({
														title: 'Items',
														headerRight: () => (
															<TouchableOpacity
																onPress={() => navigation.navigate('Add Item')}
																style={{ marginRight: 16 }}
															>
																<Icon name='plus' />
															</TouchableOpacity>
														)
													})}
												/>
												<ItemsStack.Screen
													name='Item'
													component={Item}
													options={() => ({
														title: '',
														headerBackTitleVisible: false,
														headerBackImage: () => (
															<Icon size={28} name='chevronLeft' />
														)
													})}
												/>
											</ItemsStack.Navigator>
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

	const client = createClient({
		url: env.hasuraUrl,
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : '',
				'x-hasura-admin-secret': 'market-admin-secret',
				'x-hasura-store-id': activeStore || ''
			}
		})
	});

	return (
		<Provider value={client}>
			<NavigationContainer>
				<ModalsStack.Navigator>
					<ModalsStack.Screen name='Root' options={{ headerShown: false }}>
						{() => <RootNavigator />}
					</ModalsStack.Screen>
					<ModalsStack.Group screenOptions={{ presentation: 'modal' }}>
						<ModalsStack.Screen name='Add Item' component={AddItem} />
						<ModalsStack.Screen name='Edit Item' component={EditItem} />
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
