import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import { HomeStackParamList } from '../types/navigation';
import Store from '../screens/Store';
import Orders from '../screens/Orders';
import FollowedStores from '../screens/FollowedStores';

const HomeNavigator = createNativeStackNavigator<
	HomeStackParamList,
	'HomeStack'
>();

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator id='HomeStack'>
			<HomeNavigator.Screen
				name='Home.Main'
				component={Home}
				options={{ headerShown: false }}
			/>
			<HomeNavigator.Screen
				name='Home.Order'
				component={Order}
				options={{ headerTitle: 'Order' }}
			/>
			<HomeNavigator.Screen
				name='Home.Notifications'
				component={Notifications}
				options={{ headerTitle: 'Notifications' }}
			/>
			<HomeNavigator.Screen
				name='Home.Store'
				component={Store}
				options={{ headerShown: false }}
			/>
			<HomeNavigator.Screen
				name='Home.Orders'
				component={Orders}
				options={{ headerTitle: 'Orders' }}
			/>
			<HomeNavigator.Screen
				name='Home.FollowedStores'
				component={FollowedStores}
				options={{ headerTitle: 'Followed stores' }}
			/>
		</HomeNavigator.Navigator>
	);
};

export default HomeStack;
