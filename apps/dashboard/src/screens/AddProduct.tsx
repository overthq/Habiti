import React from 'react';
import { FormInput, Screen, Spacer, TextButton } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import useGoBack from '../hooks/useGoBack';
import { useCreateProductMutation } from '../data/mutations';

export interface ProductFormData {
	name: string;
	description: string;
	unitPrice: string;
	quantity: string;
}

const addProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.string().min(1),
	quantity: z.string().min(1)
});

const AddProduct: React.FC = () => {
	const { goBack, setOptions } = useNavigation();
	const createProductMutation = useCreateProductMutation();
	useGoBack('x');

	const formMethods = useForm<z.infer<typeof addProductSchema>>({
		defaultValues: {
			name: '',
			description: '',
			unitPrice: '',
			quantity: ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: z.infer<typeof addProductSchema>) => {
			const { error } = await createProductMutation.mutateAsync({
				name: values.name,
				description: values.description,
				unitPrice: Number(values.unitPrice) * 100,
				quantity: Number(values.quantity)
			});

			// We want to preserve state when an error occurs.
			// For retries (if it's just a network thing), or for observing
			// the state that led to the error.

			goBack();
		},
		[createProductMutation, goBack]
	);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<TextButton
					disabled={createProductMutation.isPending}
					onPress={formMethods.handleSubmit(onSubmit)}
				>
					Save
				</TextButton>
			)
		});
	}, [createProductMutation.isPending]);

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
					keyboardType='number-pad'
				/>
				<Spacer y={8} />
				<FormInput
					name='quantity'
					label='Quantity'
					placeholder='Enter product quantity'
					control={formMethods.control}
					keyboardType='number-pad'
				/>
			</FormProvider>
		</Screen>
	);
};

export default AddProduct;
