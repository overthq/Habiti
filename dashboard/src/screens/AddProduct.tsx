import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';

import { Pressable, Text } from 'react-native';
import useStore from '../state';
// import useGoBack from '../hooks/useGoBack';
import {
	useCreateProductMutation,
	useAddProductImagesMutation
} from '../types/api';
import ProductForm from '../components/product/ProductForm';
import { ReactNativeFile } from 'extract-files';
import { useForm } from 'react-hook-form';

// Without handling validation, using Formik here is kind of useless.
// Also should probably look to replace it, since it's not being
// actively developed anymore.

// DISCLAIMER:
// This image uploading logic below is very hacky.
// I'm not the best RN developer out there, but even I know that this is
// a travesty.
// Please, bear with me.

interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string; // ???
	quantity: string; // ???
}

const AddProduct: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);
	const [, createProduct] = useCreateProductMutation();
	const [, addProductImages] = useAddProductImagesMutation();
	const { goBack, setOptions } = useNavigation();
	// useGoBack();

	// Remember to ensure that some weird view caching does not allow this
	// to be shared between separate product screens.

	const [toUpload, setToUpload] = React.useState<ReactNativeFile[]>([]);

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: '',
			description: '',
			unitPrice: '',
			quantity: ''
		}
	});

	const onSubmit = async (values: ProductFormData) => {
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
	};

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => {
				return (
					<Pressable
						style={{ marginRight: 16 }}
						onPress={formMethods.handleSubmit(onSubmit)}
					>
						<Text style={{ fontSize: 17 }}>Save</Text>
					</Pressable>
				);
			}
		});
	}, []);

	return (
		<FormProvider {...formMethods}>
			<ProductForm imagesToUpload={toUpload} setImagesToUpload={setToUpload} />
		</FormProvider>
	);
};

export default AddProduct;
