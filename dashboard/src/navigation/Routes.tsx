import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Overview from '../screens/Overview';
import Orders from '../screens/Orders';
import Items from '../screens/Items';
// import Settings from '../screens/Settings';
import Register from '../screens/Register';
import { useAppSelector } from '../redux/store';

// Navigation Structure
// - Auth (Stack Navigator)
//  - Authenticate
//  - Register
//  - Verify
// - Main (Tab Navigator)
//  - Overview
//  	- Settings (user and app-level settings, also includes a button to switch the currently active store)
//  - Orders
//  - Items
//  - Store (store metadata and store-related settings)

// List of all screens that will be "modals"
// - Settings
// - Add/Edit Item (and most other form-based views)

const AppStack = createStackNavigator();
const ItemStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

// When urql Provider is set up, remember to pass in active storeId, to be used in Hasura, when querying stuff like items and orders.
const Routes: React.FC = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	return (
		<NavigationContainer>
			<AppStack.Navigator>
				{accessToken ? (
					<AppStack.Screen name='Main'>
						{() => (
							<MainTab.Navigator>
								<MainTab.Screen name='Overview' component={Overview} />
								<MainTab.Screen name='Orders' component={Orders} />
								<MainTab.Screen name='Items' component={Items} />
								{/* <MainTab.Screen name='Settings' component={Settings} /> */}
							</MainTab.Navigator>
						)}
					</AppStack.Screen>
				) : (
					<AppStack.Screen name='Register' component={Register} />
				)}
			</AppStack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
