import React from 'react';
import {
	ActivityIndicator,
	Platform,
	ScrollView,
	StyleSheet
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';

import Section from '../components/product/Section';
import Images from '../components/product/Images';

import useGoBack from '../hooks/useGoBack';
import { formatNaira } from '../utils/currency';

import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import InventoryInput from '../components/product/InventoryInput';

// TODO:
// - Allow editing of inventory.
// - Set up "collections/groups" for products.
// - We can display this somehow on the store screen for shoppers.
// - Blur the line between the "Product" and "Edit Product" screens.

// To blur the lines between "Product" and "Edit Product",
// we need to have a detailed way of knowing if the values have changed from the default,
// for any of the many items on the list here.
// This might be very wasteful w.r.t. render computations, since we'd ideally
// have to check this on every re-render that relates to value changes.
// However, this would merge the "Product" and "Edit Product" screens.
// The "Add Product" screen should still be a separate one.
// More questions for this though:
// - How does the route params object look for "Add Product" vs "Product"?

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Product'>>();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	useGoBack();

	const product = data?.product;

	if (fetching || !product) return <ActivityIndicator />;

	return (
		<Formik
			initialValues={{
				name: product.name,
				description: product.description,
				unitPrice: String(product.unitPrice),
				quantity: String(product.quantity)
			}}
			onSubmit={values => {
				console.log(values);
			}}
		>
			<ScrollView
				style={styles.container}
				keyboardDismissMode={Platform.select({
					ios: 'interactive',
					android: 'on-drag'
				})}
			>
				<Section
					title='Name'
					placeholder='Product name'
					content={product.name}
					field='name'
				/>
				<Section
					title='Description'
					placeholder='Brief product description'
					content={product.description}
					field='description'
					multiline
				/>
				<Section
					title='Unit Price'
					placeholder={formatNaira(0.0)}
					content={formatNaira(product.unitPrice)}
					field='unitPrice'
				/>
				<Images productId={productId} images={product.images} />
				<InventoryInput />
			</ScrollView>
		</Formik>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 16,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default Product;
