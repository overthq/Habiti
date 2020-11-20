import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Authenticate from '../screens/Authenticate';
import Register from '../screens/Register';
import VerifyAuthentication from '../screens/VerifyAuthentication';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Carts from '../screens/Carts';
import Explore from '../screens/Explore';
import Search from '../screens/Search';
import Store from '../screens/Store';
import Item from '../screens/Item';
import Cart from '../screens/Cart';
import { Icon } from '../components/icons';
import {
	modalOptions,
	tabBarOptions,
	tabScreenOptions
} from '../utils/navigation';
import {
	AppStackParamList,
	AuthStackParamList,
	MainStackParamList
} from '../types/navigation';

const AppStack = createStackNavigator<AppStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const HomeTab = createBottomTabNavigator();

const MainNavigator = () => (
	<MainStack.Navigator>
		<MainStack.Screen
			name='Home'
			component={() => (
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

interface RoutesProps {
	accessToken: string | null;
}

const Routes: React.FC<RoutesProps> = ({ accessToken }) => (
	<NavigationContainer>
		<AppStack.Navigator mode='modal' screenOptions={modalOptions}>
			{accessToken ? (
				<>
					<AppStack.Screen name='Main' component={MainNavigator} />
					<AppStack.Screen name='Search' component={Search} />
					<AppStack.Screen name='Item' component={Item} />
					<AppStack.Screen name='Cart' component={Cart} />
				</>
			) : (
				<AppStack.Screen
					name='Auth'
					component={() => (
						<AuthStack.Navigator headerMode='none'>
							<AuthStack.Screen name='Register' component={Register} />
							<AuthStack.Screen name='Authenticate' component={Authenticate} />
							<AuthStack.Screen
								name='VerifyAuthentication'
								component={VerifyAuthentication}
							/>
						</AuthStack.Navigator>
					)}
				/>
			)}
		</AppStack.Navigator>
	</NavigationContainer>
);

export default Routes;
