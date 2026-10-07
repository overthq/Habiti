import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput, ScrollableScreen, Spacer } from '@habiti/components';

import { useCreateStoreMutation } from '../data/mutations';
import useHeaderSubmit from '../hooks/useHeaderSubmit';
import type { AppStackScreenProps } from '../navigation/types';

export interface CreateStoreFormValues {
	name: string;
	description: string;
}

const CreateStore: React.FC<AppStackScreenProps<'Modal.CreateStore'>> = ({
	navigation
}) => {
	const createStoreMutation = useCreateStoreMutation();
	const methods = useForm<CreateStoreFormValues>();

	const onSubmit = React.useCallback(
		async (values: CreateStoreFormValues) => {
			await createStoreMutation.mutateAsync(values);
			navigation.goBack();
		},
		[createStoreMutation, navigation]
	);

	useHeaderSubmit({
		onSubmit: methods.handleSubmit(onSubmit),
		loading: createStoreMutation.isPending
	});

	return (
		<ScrollableScreen withToolbar>
			<Spacer y={16} />
			<FormInput
				autoFocus
				control={methods.control}
				name='name'
				label='Store name'
				placeholder='Nike'
			/>
			<Spacer y={16} />
			<FormInput
				control={methods.control}
				name='description'
				label='Store description'
				placeholder='Brief description of your store'
				textArea
			/>
		</ScrollableScreen>
	);
};

export default CreateStore;
