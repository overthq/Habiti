import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StoreStack from './StoreStack';
import Explore from '../screens/Explore';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import { HomeStackParamList } from '../types/navigation';

const HomeNavigator = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator>
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
				component={StoreStack}
				options={{ headerShown: false }}
			/>
			<HomeNavigator.Screen
				name='Home.Search'
				component={Explore}
				options={{ headerShown: false }}
			/>
		</HomeNavigator.Navigator>
	);
};

export default HomeStack;
