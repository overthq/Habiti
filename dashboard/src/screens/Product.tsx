import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';

import useGoBack from '../hooks/useGoBack';

import { useEditProductMutation, useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import ProductForm from '../components/product/ProductForm';

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

	useGoBack();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	const [, editProduct] = useEditProductMutation();

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
				editProduct({
					id: productId,
					input: {
						...values,
						unitPrice: Number(values.unitPrice),
						quantity: Number(values.quantity)
					}
				});
			}}
		>
			<ProductForm images={product.images} />
		</Formik>
	);
};

export default Product;
