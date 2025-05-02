import { Button, FormInput, Spacer } from '@habiti/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';
import { useCreateStoreMutation } from '../../types/api';
import { useShallow } from 'zustand/react/shallow';

export interface CreateStoreFormValues {
	name: string;
	description: string;
	twitter: string;
	instagram: string;
	website: string;
}

const CreateStoreForm: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	const setPreference = useStore(useShallow(state => state.setPreference));
	const methods = useForm<CreateStoreFormValues>();

	useGoBack('x');

	const onSubmit = React.useCallback(
		async (values: CreateStoreFormValues) => {
			const { data, error } = await createStore({ input: values });

			if (data?.createStore?.id) {
				setPreference({ activeStore: data.createStore.id });
			} else if (error) {
				console.log('Error while creating store:', error);
			}
		},
		[setPreference, createStore]
	);

	return (
		<View>
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
			<FormInput
				control={methods.control}
				label='Website'
				name='website'
				placeholder='https://nike.com'
				keyboardType='url'
				autoCorrect={false}
				autoCapitalize='none'
			/>
			<Spacer y={16} />
			<Button text='Submit' onPress={methods.handleSubmit(onSubmit)} />
		</View>
	);
};

export default CreateStoreForm;
