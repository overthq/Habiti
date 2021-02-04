import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import { useAppSelector } from '../redux/store';

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
//   - Item
//    - AddItem
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
const Routes: React.FC = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	return (
		<NavigationContainer>
			<AppStack.Navigator>
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
											<OrdersStack.Screen
												name='OrdersList'
												component={Orders}
											/>
											<OrdersStack.Screen name='Order' component={Order} />
										</OrdersStack.Navigator>
									)}
								</MainTab.Screen>
								<MainTab.Screen name='Items'>
									{() => (
										<ItemsStack.Navigator>
											<ItemsStack.Screen name='ItemsList' component={Items} />
											<ItemsStack.Screen name='Item' component={Item} />
										</ItemsStack.Navigator>
									)}
								</MainTab.Screen>
							</MainTab.Navigator>
						)}
					</AppStack.Screen>
				) : (
					<>
						<AppStack.Screen name='Verify' component={Verify} />
						<AppStack.Screen name='Authenticate' component={Authenticate} />
						<AppStack.Screen name='Register' component={Register} />
					</>
				)}
			</AppStack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
