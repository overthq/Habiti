import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';

import { useCreateProductMutation } from '../types/api';
import ProductForm from '../components/product/ProductForm';
import { useForm } from 'react-hook-form';
import { generateUploadFile } from '../utils/images';

export interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string; // ???
	quantity: string; // ???
}

const AddProduct: React.FC = () => {
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
			await createProduct({
				input: {
					name: values.name,
					description: values.description,
					unitPrice: Number(values.unitPrice) * 100,
					quantity: Number(values.quantity),
					imageFiles: toUpload.map(generateUploadFile)
				}
			});

			setToUpload([]);

			goBack();
		},
		[toUpload]
	);

	React.useLayoutEffect(() => {
		setOptions({
			headerLeft: () => {
				return (
					<Pressable style={{ marginLeft: 16 }} onPress={goBack}>
						<Text style={{ fontSize: 16 }}>Cancel</Text>
					</Pressable>
				);
			},
			headerRight: () => {
				return (
					<Pressable
						style={{ marginRight: 16 }}
						onPress={formMethods.handleSubmit(onSubmit)}
					>
						<Text style={{ fontSize: 16 }}>Save</Text>
					</Pressable>
				);
			}
		});
	}, [toUpload]);

	return (
		<FormProvider {...formMethods}>
			<ProductForm imagesToUpload={toUpload} setImagesToUpload={setToUpload} />
		</FormProvider>
	);
};

export default AddProduct;
