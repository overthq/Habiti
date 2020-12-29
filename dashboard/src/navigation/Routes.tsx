import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAppSelector } from '../redux/store';

// Navigation Structure
// - Auth (Stack Navigator)
//  - Authenticate
//  - Register
//  - Verify
// - Main (Drawer Navigator)
//  - Overview
//  - Orders
//  - Items
//  - Settings (also includes a button to switch the currently active store)

const AppStack = createStackNavigator();
const MainDrawer = createDrawerNavigator();

const Routes = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	return (
		<NavigationContainer>
			<AppStack.Navigator>
				{accessToken ? (
					<AppStack.Screen name='Main'>
						{() => <MainDrawer.Navigator></MainDrawer.Navigator>}
					</AppStack.Screen>
				) : (
					<AppStack.Screen name='Register' />
				)}
			</AppStack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
