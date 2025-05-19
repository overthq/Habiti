import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Product from '../screens/Product';
import ProductCategories from '../screens/ProductCategories';
import ProductImages from '../screens/ProductImages';

import { ProductStackParamList } from '../types/navigation';

const ProductStack = createNativeStackNavigator<
	ProductStackParamList,
	'ProductStack'
>();

const ProductStackNavigator = () => {
	return (
		<ProductStack.Navigator id='ProductStack'>
			<ProductStack.Screen name='Product' component={Product} />
			<ProductStack.Screen name='ProductImages' component={ProductImages} />
			<ProductStack.Screen
				name='ProductCategories'
				component={ProductCategories}
			/>
		</ProductStack.Navigator>
	);
};

export default ProductStackNavigator;
