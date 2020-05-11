import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider, createClient } from 'urql';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Authenticate from './src/screens/Authenticate';
import Register from './src/screens/Register';
import VerifyAuthentication from './src/screens/VerifyAuthentication';
import Home from './src/screens/Home';
// import Settings from './src/screens/Settings';
import Carts from './src/screens/Carts';
// import { ItemSheetProvider } from './src/contexts/ItemSheetContext';
import { CartsProvider } from './src/contexts/CartsContext';
import useAccessToken from './src/hooks/useAccessToken';
import Explore from './src/screens/Explore';
import { Icon, IconType } from './src/components/icons';

// Navigation: List of app screens
// 1: Home
// 2: Search (or "Explore")
// 3: Carts (multiple carts for each)
// 4: Orders
// 5: Store
//
// Navigation Hierarchy (main - Stack):
// 1. Auth
// 2. Main:
//  - Home (For You)
//  - Explore
//  -

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
// const SettingsStack = createStackNavigator();

const AuthNavigator = () => (
	<AuthStack.Navigator headerMode='none'>
		<AuthStack.Screen name='Register' component={Register} />
		<AuthStack.Screen name='Authenticate' component={Authenticate} />
		<AuthStack.Screen
			name='VerifyAuthentication'
			component={VerifyAuthentication}
		/>
	</AuthStack.Navigator>
);

// const SettingsNavigator = () => {
// 	return (
// 		<SettingsStack.Navigator>
// 			<SettingsStack.Screen name='Menu' component={Settings} />
// 			<SettingsStack.Screen name='Name' component={NamePage} />
// 			<SettingsStack.Screen name='Phone' component={PhonePage} />
// 		</SettingsStack.Navigator>
// 	);
// };

// Convert this navigator to a bottom-tab one.
const MainNavigator = () => {
	return (
		<MainTab.Navigator
			screenOptions={({ route }) => ({
				// eslint-disable-next-line
				tabBarIcon: ({ color }) => {
					const getIcon = (routeName: string): IconType => {
						if (routeName === 'HomeMain') {
							return 'home';
						} else if (route.name === 'Explore') {
							return 'search';
						} else if (route.name === 'Carts') {
							return 'shoppingBag';
						}
						throw new Error('route not exist');
					};

					return <Icon name={getIcon(route.name)} color={color} size={28} />;
				}
			})}
			tabBarOptions={{
				activeTintColor: 'black',
				inactiveTintColor: 'gray',
				showLabel: false
			}}
		>
			<MainTab.Screen name='HomeMain' component={Home} />
			<MainTab.Screen name='Explore' component={Explore} />
			<MainTab.Screen name='Carts' component={Carts} />
		</MainTab.Navigator>
	);
};

const App = () => {
	const { loading, accessToken } = useAccessToken();

	const client = createClient({
		url: 'http://localhost:5000',
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		})
	});

	return loading ? (
		<View>
			<ActivityIndicator />
		</View>
	) : (
		<Provider value={client}>
			<CartsProvider>
				<SafeAreaProvider>
					<NavigationContainer>
						<AppStack.Navigator
							initialRouteName={!!accessToken ? 'Main' : 'Auth'}
							headerMode='none'
						>
							<AppStack.Screen name='Auth' component={AuthNavigator} />
							<AppStack.Screen name='Main' component={MainNavigator} />
						</AppStack.Navigator>
					</NavigationContainer>
				</SafeAreaProvider>
			</CartsProvider>
		</Provider>
	);
};

export default App;
