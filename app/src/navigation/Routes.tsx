import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'urql';

import Authenticate from '../screens/Authenticate';
import Register from '../screens/Register';
import Verify from '../screens/Verify';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Carts from '../screens/Carts';
import Explore from '../screens/Explore';
import Store from '../screens/Store';
import Item from '../screens/Item';
import Cart from '../screens/Cart';
import { tabBarOptions, tabScreenOptions } from '../utils/navigation';
import {
	AppStackParamList,
	HomeTabParamList,
	MainStackParamList
} from '../types/navigation';
import { useAppSelector } from '../redux/store';
import { create } from '../utils/client';

const AppStack = createStackNavigator<AppStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const Main = () => (
	<MainStack.Navigator screenOptions={{ headerShown: false }}>
		<MainStack.Screen name='Home'>
			{() => (
				<HomeTab.Navigator
					screenOptions={tabScreenOptions}
					tabBarOptions={tabBarOptions}
				>
					<HomeTab.Screen name='For You' component={Home} />
					<HomeTab.Screen name='Explore' component={Explore} />
					<HomeTab.Screen name='Carts' component={Carts} />
					<HomeTab.Screen name='Profile' component={Profile} />
				</HomeTab.Navigator>
			)}
		</MainStack.Screen>
		<MainStack.Screen name='Store' component={Store} />
	</MainStack.Navigator>
);

const Routes: React.FC = () => {
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);
	const client = React.useMemo(() => create(accessToken), [accessToken]);

	return (
		<Provider value={client}>
			<NavigationContainer>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							<AppStack.Screen name='Main' component={Main} />
							<AppStack.Screen name='Item' component={Item} />
							<AppStack.Screen name='Cart' component={Cart} />
						</>
					) : (
						<>
							<AppStack.Screen name='Register' component={Register} />
							<AppStack.Screen name='Authenticate' component={Authenticate} />
							<AppStack.Screen name='Verify' component={Verify} />
						</>
					)}
				</AppStack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
