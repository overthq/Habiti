import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Provider, createClient } from 'urql';
import { NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	TransitionPresets
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Authenticate from './src/screens/Authenticate';
import Register from './src/screens/Register';
import VerifyAuthentication from './src/screens/VerifyAuthentication';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Carts from './src/screens/Carts';
import { CartsProvider } from './src/contexts/CartsContext';
import useAccessToken from './src/hooks/useAccessToken';
import Explore from './src/screens/Explore';
import Search from './src/screens/Search';
import { Icon, IconType } from './src/components/icons';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

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

const MainNavigator = () => (
	<MainTab.Navigator
		screenOptions={({ route }) => ({
			// eslint-disable-next-line
			tabBarIcon: ({ color }) => {
				const getIcon = (routeName: string): IconType => {
					switch (routeName) {
						case 'Home':
							return 'home';
						case 'Explore':
							return 'search';
						case 'Carts':
							return 'shoppingBag';
						case 'Profile':
							return 'user';
					}
					throw new Error('Specified route does not exist.');
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
		<MainTab.Screen name='Home' component={Home} />
		<MainTab.Screen name='Explore' component={Explore} />
		<MainTab.Screen name='Carts' component={Carts} />
		<MainTab.Screen name='Profile' component={Profile} />
	</MainTab.Navigator>
);

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
							<AppStack.Screen
								name='Search'
								component={Search}
								options={{
									gestureEnabled: true,
									cardOverlayEnabled: true,
									...(Platform.OS === 'ios'
										? TransitionPresets.ModalPresentationIOS
										: TransitionPresets.RevealFromBottomAndroid)
								}}
							/>
						</AppStack.Navigator>
					</NavigationContainer>
				</SafeAreaProvider>
			</CartsProvider>
		</Provider>
	);
};

export default App;
