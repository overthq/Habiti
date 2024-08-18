import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StoreStack from './StoreStack';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Order from '../screens/Order';
import { HomeStackParamList } from '../types/navigation';

const HomeNavigator = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
	return (
		<HomeNavigator.Navigator>
			<HomeNavigator.Screen name='Home' component={Home} />
			<HomeNavigator.Screen name='Order' component={Order} />
			<HomeNavigator.Screen name='Notifications' component={Notifications} />
			<HomeNavigator.Screen
				name='Store'
				component={StoreStack}
				options={{ headerShown: false }}
			/>
		</HomeNavigator.Navigator>
	);
};

export default HomeStack;
