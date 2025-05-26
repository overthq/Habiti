import { FormInput, Screen, Spacer, TextButton } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';
import { useCreateProductMutation } from '../types/api';
import { generateUploadFile } from '../utils/images';

export interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string;
	quantity: string;
}

const AddProduct: React.FC = () => {
	const { goBack, setOptions } = useNavigation();
	const [{ fetching }, createProduct] = useCreateProductMutation();
	useGoBack('x');

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: '',
			description: '',
			unitPrice: '',
			quantity: ''
		}
	});

	const onSubmit = React.useCallback(async (values: ProductFormData) => {
		const { error } = await createProduct({
			input: {
				name: values.name,
				description: values.description,
				unitPrice: Number(values.unitPrice) * 100,
				// quantity: Number(values.quantity)
				quantity: 1
			}
		});

		// We want to preserve state when an error occurs.
		// For retries (if it's just a network thing), or for observing
		// the state that led to the error.

		if (error) {
			console.log('Error while creating product');
			console.log(error);
		} else {
			goBack();
		}
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<TextButton
					disabled={fetching}
					onPress={formMethods.handleSubmit(onSubmit)}
				>
					Save
				</TextButton>
			)
		});
	}, [fetching]);

	return (
		<Screen style={{ padding: 16 }}>
			<FormProvider {...formMethods}>
				<FormInput
					name='name'
					label='Name'
					placeholder='Enter product name'
					control={formMethods.control}
				/>
				<Spacer y={8} />
				<FormInput
					name='description'
					label='Description'
					placeholder='Describe your product'
					control={formMethods.control}
					textArea
				/>
				<Spacer y={8} />
				<FormInput
					name='unitPrice'
					label='Price'
					placeholder='Enter product price'
					control={formMethods.control}
				/>
			</FormProvider>
		</Screen>
	);
};

export default AddProduct;
