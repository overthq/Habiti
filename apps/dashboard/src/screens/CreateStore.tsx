import React from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	Button,
	FormInput,
	ScrollableScreen,
	Spacer
} from '@habiti/components';

import { useCreateStoreMutation } from '../data/mutations';
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
	const { bottom } = useSafeAreaInsets();

	const onSubmit = React.useCallback(
		async (values: CreateStoreFormValues) => {
			await createStoreMutation.mutateAsync(values);
			navigation.goBack();
		},
		[createStoreMutation, navigation]
	);

	return (
		<ScrollableScreen contentContainerStyle={{ paddingBottom: bottom + 16 }}>
			<Spacer y={16} />
			<FormInput
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
			<Spacer y={16} />
			<Button
				text='Submit'
				loading={createStoreMutation.isPending}
				onPress={methods.handleSubmit(onSubmit)}
			/>
		</ScrollableScreen>
	);
};

export default CreateStore;
