import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';

import useStore from '../state';
import useGoBack from '../hooks/useGoBack';
import {
	useCreateProductMutation,
	useAddProductImagesMutation
} from '../types/api';
import ProductForm from '../components/product/ProductForm';
import { ReactNativeFile } from 'extract-files';

// Without handling validation, using Formik here is kind of useless.
// Also should probably look to replace it, since it's not being
// actively developed anymore.

// DISCLAIMER:
// This image uploading logic below is very hacky.
// I'm not the best RN developer out there, but even I know that this is
// a travesty.
// Please, bear with me.

const AddProduct: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);
	const [, createProduct] = useCreateProductMutation();
	const [, addProductImages] = useAddProductImagesMutation();
	const { goBack } = useNavigation();
	useGoBack();

	// Remember to ensure that some weird view caching does not allow this
	// to be shared between separate product screens.

	const [toUpload, setToUpload] = React.useState<ReactNativeFile[]>([]);

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: '',
					unitPrice: '',
					quantity: ''
				}}
				onSubmit={async values => {
					try {
						if (activeStore) {
							const { data } = await createProduct({
								input: {
									name: values.name,
									description: values.description,
									storeId: activeStore,
									unitPrice: Number(values.unitPrice) * 100,
									quantity: Number(values.quantity)
								}
							});

							if (toUpload.length > 0 && data?.createProduct.id) {
								await addProductImages({
									id: data.createProduct.id,
									input: { imageFiles: toUpload }
								});
							}

							// TODO: Instead of navigating to the previous screen, we should either:
							// - Switch this screen to a "View Product" context.
							// - Navigate to the "Product" screen, using the productId.

							goBack();
						}
					} catch (error) {
						console.log(error);
					}
				}}
			>
				<ProductForm
					imagesToUpload={toUpload}
					setImagesToUpload={setToUpload}
				/>
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8,
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	input: {
		marginBottom: 10
	}
});

export default AddProduct;
