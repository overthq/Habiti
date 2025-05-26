import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Product from '../screens/Product';
import ProductCategories from '../screens/ProductCategories';
import ProductImages from '../screens/ProductImages';
import ProductDetails from '../screens/ProductDetails';

import { ProductStackParamList } from '../types/navigation';

const ProductStack = createNativeStackNavigator<
	ProductStackParamList,
	'ProductStack'
>();

const ProductStackNavigator = () => {
	return (
		<ProductStack.Navigator id='ProductStack'>
			<ProductStack.Screen
				name='Product.Main'
				component={Product}
				options={{
					headerTitle: 'Product'
				}}
			/>
			<ProductStack.Screen
				name='Product.Images'
				component={ProductImages}
				options={{ headerTitle: 'Media' }}
			/>
			<ProductStack.Screen
				name='Product.Categories'
				component={ProductCategories}
				options={{ headerTitle: 'Categories' }}
			/>
			<ProductStack.Screen
				name='Product.Details'
				component={ProductDetails}
				options={{ headerTitle: 'Product Details' }}
			/>
		</ProductStack.Navigator>
	);
};

export default ProductStackNavigator;
