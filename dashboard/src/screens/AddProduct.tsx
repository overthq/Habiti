import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';

import { Pressable, Text } from 'react-native';
import useStore from '../state';
import { useCreateProductMutation } from '../types/api';
import ProductForm from '../components/product/ProductForm';
import { useForm } from 'react-hook-form';
import { generateUploadFile } from '../utils/images';
import Button from '../components/global/Button';

// DISCLAIMER:
// This image uploading logic below is very hacky.
// I'm not the best RN developer out there, but even I know that this is
// a travesty.
// Please, bear with me.

// TODO:
// - We should probably merge the product and add product screens.
//   (Conditional: !!productId)

export interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string; // ???
	quantity: string; // ???
}

const AddProduct: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);
	const [toUpload, setToUpload] = React.useState<string[]>([]);
	const { goBack, setOptions } = useNavigation();
	const [, createProduct] = useCreateProductMutation();

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: '',
			description: '',
			unitPrice: '',
			quantity: ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: ProductFormData) => {
			if (activeStore) {
				await createProduct({
					input: {
						name: values.name,
						description: values.description,
						storeId: activeStore,
						unitPrice: Number(values.unitPrice) * 100,
						quantity: Number(values.quantity),
						imageFiles: toUpload.map(generateUploadFile)
					}
				});

				goBack();
			}
		},
		[toUpload]
	);

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
	}, [toUpload]);

	return (
		<FormProvider {...formMethods}>
			<ProductForm imagesToUpload={toUpload} setImagesToUpload={setToUpload} />
			<Button text='Submit' onPress={formMethods.handleSubmit(onSubmit)} />
		</FormProvider>
	);
};

export default AddProduct;
