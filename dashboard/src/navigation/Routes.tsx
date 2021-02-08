import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	TransitionPresets
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
import { useAppSelector } from '../redux/store';
import { Icon } from '../components/icons';
import AddItem from '../screens/AddItem';
import EditItem from '../screens/EditItem';

// TODO: Complete refactoring of this component, after confirmation that it even works as is.
// Experimentation with screen presets for making modals work on a per-screen basis, instead of a per-navigator basis.

// Navigation Structure
// - Auth (Stack Navigator)
//  - Authenticate
//  - Register
//  - Verify
// - Main (Tab Navigator)
//  - Overview
//  	- Settings (user and app-level settings, also includes a button to switch the currently active store)
//  - Orders (Stack Navigator)
//   - OrdersList
//   - Order
//  - Items (Stack Navigator)
//   - ItemsList
//   - AddItem
//   - Item
//    - EditItem
//  - Store (store metadata and store-related settings)

// List of all screens that will be "modals"
// - Settings
// - Add/Edit Item (and most other form-based views)

const AppStack = createStackNavigator();
const OverviewStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

// When urql Provider is set up, remember to pass in active storeId, to be used in Hasura, when querying stuff like items and orders.
// TODO: After confirming that this structure works, decouple it to make it more understandable.
// It should be noted that the nesting of some navigators is intended to make sure that modals work as intended.
const RootNavigator: React.FC = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	return (
		<AppStack.Navigator headerMode='none'>
			{accessToken ? (
				<AppStack.Screen name='Main'>
					{() => (
						<MainTab.Navigator>
							<MainTab.Screen name='Overview'>
								{() => (
									<OverviewStack.Navigator mode='modal'>
										<OverviewStack.Screen name='Home' component={Overview} />
										<OverviewStack.Screen
											name='Settings'
											component={Settings}
										/>
									</OverviewStack.Navigator>
								)}
							</MainTab.Screen>
							<MainTab.Screen name='Orders'>
								{() => (
									<OrdersStack.Navigator>
										<OrdersStack.Screen name='OrdersList' component={Orders} />
										<OrdersStack.Screen name='Order' component={Order} />
									</OrdersStack.Navigator>
								)}
							</MainTab.Screen>
							<MainTab.Screen name='Items'>
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
										<ItemsStack.Screen name='Item' component={Item} />
									</ItemsStack.Navigator>
								)}
							</MainTab.Screen>
							<MainTab.Screen name='Store' component={Store} />
						</MainTab.Navigator>
					)}
				</AppStack.Screen>
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

const Routes = () => {
	return (
		<NavigationContainer>
			<ModalsStack.Navigator
				mode='modal'
				screenOptions={({ route, navigation }) => ({
					gestureEnabled: true,
					cardOverlayEnabled: true,
					// cardStyle: { backgroundColor: 'transparent' },
					headerStatusBarHeight:
						navigation.dangerouslyGetState().routes.indexOf(route) > 0
							? 0
							: undefined,
					...TransitionPresets.ModalPresentationIOS
				})}
			>
				<ModalsStack.Screen name='Root' options={{ headerShown: false }}>
					{() => <RootNavigator />}
				</ModalsStack.Screen>
				<ModalsStack.Screen name='Add Item' component={AddItem} />
				<ModalsStack.Screen name='Edit Item' component={EditItem} />
			</ModalsStack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
