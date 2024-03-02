import { TextButton } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ProductForm from '../components/product/ProductForm';
import { useCreateProductMutation } from '../types/api';
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
			headerLeft: () => (
				<TextButton style={{ marginLeft: 16 }} onPress={goBack}>
					Cancel
				</TextButton>
			),
			headerRight: () => (
				<TextButton
					style={{ marginRight: 16 }}
					onPress={formMethods.handleSubmit(onSubmit)}
				>
					Save
				</TextButton>
			)
		});
	}, [toUpload]);

	return (
		<FormProvider {...formMethods}>
			<ProductForm imagesToUpload={toUpload} setImagesToUpload={setToUpload} />
		</FormProvider>
	);
};

export default AddProduct;
