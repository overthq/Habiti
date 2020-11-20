import React from 'react';
import { Platform } from 'react-native';
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
import Explore from './src/screens/Explore';
import Search from './src/screens/Search';
import Store from './src/screens/Store';
import Item from './src/screens/Item';
import Cart from './src/screens/Cart';
import { Icon } from './src/components/icons';
import {
	AppStackParamList,
	AuthStackParamList,
	MainStackParamList
} from './src/types/navigation';
import { useAppSelector } from './src/redux/store';
import { getIcon } from './src/utils/navigation';
import env from './env';

const RootStack = createStackNavigator();
const AppStack = createStackNavigator<AppStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const HomeTab = createBottomTabNavigator();

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

const HomeNavigator = () => (
	<HomeTab.Navigator
		screenOptions={({ route }) => ({
			// eslint-disable-next-line
			tabBarIcon: ({ color }) => (
				<Icon name={getIcon(route.name)} color={color} size={28} />
			)
		})}
		tabBarOptions={{
			activeTintColor: 'black',
			inactiveTintColor: 'gray',
			showLabel: false
		}}
	>
		<HomeTab.Screen name='For You' component={Home} />
		<HomeTab.Screen name='Explore' component={Explore} />
		<HomeTab.Screen name='Carts' component={Carts} />
		<HomeTab.Screen name='Profile' component={Profile} />
	</HomeTab.Navigator>
);

const MainNavigator = () => (
	<MainStack.Navigator>
		<MainStack.Screen
			name='Home'
			component={HomeNavigator}
			options={{ headerShown: false }}
		/>
		<MainStack.Screen
			name='Store'
			component={Store}
			options={{
				headerBackTitleVisible: false,
				// eslint-disable-next-line
				headerBackImage: () => <Icon name='chevronLeft' size={30} />,
				headerLeftContainerStyle: { paddingLeft: 8 }
			}}
		/>
	</MainStack.Navigator>
);

const RootNavigator = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			{accessToken ? (
				<RootStack.Screen name='Main' component={MainNavigator} />
			) : (
				<RootStack.Screen name='Auth' component={AuthNavigator} />
			)}
		</RootStack.Navigator>
	);
};

const modalOptions = {
	headerShown: false,
	gestureEnabled: true,
	cardOverlayEnabled: true,
	...(Platform.OS === 'ios'
		? TransitionPresets.ModalPresentationIOS
		: TransitionPresets.RevealFromBottomAndroid)
};

const App = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);

	const client = createClient({
		url: env.hasuraUrl,
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		})
	});

	return (
		<Provider value={client}>
			<SafeAreaProvider>
				<NavigationContainer>
					<AppStack.Navigator mode='modal' screenOptions={modalOptions}>
						<AppStack.Screen name='Root' component={RootNavigator} />
						<AppStack.Screen name='Search' component={Search} />
						<AppStack.Screen name='Item' component={Item} />
						<AppStack.Screen name='Cart' component={Cart} />
					</AppStack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		</Provider>
	);
};

export default App;
