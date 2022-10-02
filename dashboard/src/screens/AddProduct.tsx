import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';

import { Pressable, Text } from 'react-native';
import useStore from '../state';
import {
	useCreateProductMutation,
	useAddProductImagesMutation
} from '../types/api';
import ProductForm from '../components/product/ProductForm';
import { ReactNativeFile } from 'extract-files';
import { useForm } from 'react-hook-form';

// DISCLAIMER:
// This image uploading logic below is very hacky.
// I'm not the best RN developer out there, but even I know that this is
// a travesty.
// Please, bear with me.

export interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string; // ???
	quantity: string; // ???
}

const AddProduct: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);
	const [toUpload, setToUpload] = React.useState<ReactNativeFile[]>([]);
	const { goBack, setOptions } = useNavigation();

	const [, createProduct] = useCreateProductMutation();
	const [, addProductImages] = useAddProductImagesMutation();

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
			headerLeft: () => {
				return (
					<Pressable style={{ marginLeft: 16 }} onPress={goBack}>
						<Text style={{ fontSize: 17 }}>Cancel</Text>
					</Pressable>
				);
			},
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
