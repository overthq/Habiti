import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Carts from '../screens/Carts';
import { CartStackParamList } from '../types/navigation';

const CartsNavigator = createNativeStackNavigator<
	CartStackParamList,
	'CartStack'
>();

const CartsStack = () => {
	return (
		<CartsNavigator.Navigator id='CartStack'>
			<CartsNavigator.Screen
				name='Carts.Main'
				component={Carts}
				options={{ headerShown: false }}
			/>
		</CartsNavigator.Navigator>
	);
};

export default CartsStack;
