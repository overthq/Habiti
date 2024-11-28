import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StoreStack from './StoreStack';
import Explore from '../screens/Explore';
import { ExploreStackParamList } from '../types/navigation';

const ExploreNavigator = createNativeStackNavigator<ExploreStackParamList>();

const ExploreStack = () => {
	return (
		<ExploreNavigator.Navigator>
			<ExploreNavigator.Screen
				name='Explore.Main'
				component={Explore}
				options={{ headerShown: false }}
			/>
			<ExploreNavigator.Screen
				name='Explore.Store'
				component={StoreStack}
				options={{ headerShown: false }}
			/>
		</ExploreNavigator.Navigator>
	);
};

export default ExploreStack;
