import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Carts from '../screens/Carts';
import { CartStackParamList } from '../types/navigation';

const CartsNavigator = createNativeStackNavigator<CartStackParamList>();

const CartsStack = () => {
	return (
		<CartsNavigator.Navigator>
			<CartsNavigator.Screen
				name='Carts.Main'
				component={Carts}
				options={{ headerTitle: 'Carts' }}
			/>
		</CartsNavigator.Navigator>
	);
};

export default CartsStack;
