import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import { HomeStackParamList } from '../types/navigation';
import Store from '../screens/Store';

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
		</HomeNavigator.Navigator>
	);
};

export default HomeStack;
