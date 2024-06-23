import { TextButton } from '@habiti/components';
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
	const [{ fetching }, createProduct] = useCreateProductMutation();

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
			const { error } = await createProduct({
				input: {
					name: values.name,
					description: values.description,
					unitPrice: Number(values.unitPrice) * 100,
					quantity: Number(values.quantity),
					imageFiles: toUpload.map(generateUploadFile)
				}
			});

			// We want to preserve state when an error occurs.
			// For retries (if it's just a network thing), or for observing
			// the state that led to the error.

			if (error) {
				console.log('Error while creating product');
				console.log(error);
			} else {
				setToUpload([]);
				goBack();
			}
		},
		[toUpload]
	);

	React.useLayoutEffect(() => {
		setOptions({
			headerLeft: () => <TextButton onPress={goBack}>Cancel</TextButton>,
			headerRight: () => (
				<TextButton
					disabled={fetching}
					onPress={formMethods.handleSubmit(onSubmit)}
				>
					Save
				</TextButton>
			)
		});
	}, [toUpload, fetching]);

	return (
		<FormProvider {...formMethods}>
			<ProductForm
				mode='add'
				imagesToUpload={toUpload}
				setImagesToUpload={setToUpload}
			/>
		</FormProvider>
	);
};

export default AddProduct;
