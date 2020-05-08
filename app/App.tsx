import React from 'react';
import { Platform } from 'react-native';
import { Provider, createClient } from 'urql';
import { NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	TransitionPresets
} from '@react-navigation/stack';

import { UserProvider, UserContext } from './src/contexts/UserContext';
import Authenticate from './src/screens/Authenticate';
import Register from './src/screens/Register';
import VerifyAuthentication from './src/screens/VerifyAuthentication';
import Home from './src/screens/Home';
// import Settings from './src/screens/Settings';
import Carts from './src/screens/Carts';
// import { ItemSheetProvider } from './src/contexts/ItemSheetContext';
import { CartsProvider } from './src/contexts/CartsContext';

const client = createClient({ url: 'http://localhost:5000' });

// Navigation: List of app screens
// 1: Home
// 2: Search (or "Explore")
// 3: Carts (multiple carts for each)
// 4: Orders
// 5: Store

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
// const SettingsStack = createStackNavigator();
const MainStack = createStackNavigator();

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

const MainNavigator = () => (
	<MainStack.Navigator
		mode='modal'
		screenOptions={{
			gestureEnabled: true,
			cardOverlayEnabled: true,
			...(Platform.OS === 'ios'
				? TransitionPresets.ModalPresentationIOS
				: TransitionPresets.RevealFromBottomAndroid)
		}}
	>
		<MainStack.Screen
			name='Home'
			component={Home}
			options={{ headerShown: false }}
		/>
		<MainStack.Screen
			name='Carts'
			component={Carts}
			options={{ headerShown: false }}
		/>
		{/*
			<MainStack.Screen name='Settings' component={SettingsNavigator} />
		*/}
	</MainStack.Navigator>
);

const Root = () => {
	const { user } = React.useContext(UserContext);

	return (
		<NavigationContainer>
			<AppStack.Navigator
				initialRouteName={!!user ? 'Main' : 'Auth'}
				headerMode='none'
			>
				<AppStack.Screen name='Auth' component={AuthNavigator} />
				<AppStack.Screen name='Main' component={MainNavigator} />
			</AppStack.Navigator>
		</NavigationContainer>
	);
};

const App = () => {
	return (
		<Provider value={client}>
			<UserProvider>
				<CartsProvider>
					<Root />
				</CartsProvider>
			</UserProvider>
		</Provider>
	);
};

export default App;
