import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchStore from '../screens/SearchStore';
import Store from '../screens/Store';
import { StoreStackParamList } from '../types/navigation';

const StoreNavigator = createNativeStackNavigator<StoreStackParamList>();

const StoreStack = () => {
	return (
		<StoreNavigator.Navigator>
			<StoreNavigator.Screen
				name='Store.Main'
				component={Store}
				options={{ headerShown: false }}
			/>
			<StoreNavigator.Screen
				name='Store.Search'
				component={SearchStore}
				options={{ headerShown: false }}
			/>
		</StoreNavigator.Navigator>
	);
};

export default StoreStack;
