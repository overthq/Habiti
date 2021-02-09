import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, createClient } from 'urql';

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
import { Icon } from '../components/icons';
import { tabBarOptions, tabScreenOptions } from '../utils/navigation';
import { AppStackParamList, MainStackParamList } from '../types/navigation';
import { useAppSelector } from '../redux/store';
import env from '../../env';

const AppStack = createStackNavigator<AppStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const HomeTab = createBottomTabNavigator();

const MainNavigator = () => (
	<MainStack.Navigator>
		<MainStack.Screen name='Home' options={{ headerShown: false }}>
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

const Routes: React.FC = () => {
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
			<NavigationContainer>
				<AppStack.Navigator headerMode='none'>
					{accessToken ? (
						<>
							<AppStack.Screen name='Main' component={MainNavigator} />
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
