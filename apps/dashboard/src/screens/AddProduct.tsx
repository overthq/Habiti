import React from 'react';
import { FormInput, ScrollableScreen, Spacer } from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateProductMutation } from '../data/mutations';
import useHeaderSubmit from '../hooks/useHeaderSubmit';
import type { AppStackScreenProps } from '../navigation/types';

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

const AddProduct: React.FC<AppStackScreenProps<'Modal.AddProduct'>> = ({
	navigation
}) => {
	const createProductMutation = useCreateProductMutation();

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

			navigation.goBack();
		},
		[createProductMutation, navigation]
	);

	useHeaderSubmit({
		onSubmit: formMethods.handleSubmit(onSubmit),
		loading: createProductMutation.isPending
	});

	return (
		<ScrollableScreen withToolbar>
			<Spacer y={16} />
			<FormProvider {...formMethods}>
				<FormInput
					autoFocus
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
		</ScrollableScreen>
	);
};

export default AddProduct;
