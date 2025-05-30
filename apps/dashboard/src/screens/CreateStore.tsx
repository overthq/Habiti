import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useCreateStoreMutation } from '../types/api';
import { useShallow } from 'zustand/react/shallow';

export interface CreateStoreFormValues {
	name: string;
	description: string;
	twitter: string;
	instagram: string;
	website: string;
}

const CreateStore: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	const setPreference = useStore(useShallow(state => state.setPreference));
	const methods = useForm<CreateStoreFormValues>();
	const { bottom } = useSafeAreaInsets();

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
		<Screen style={{ padding: 16, paddingTop: 64, paddingBottom: bottom }}>
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
				label='Twitter username'
				name='twitter'
				placeholder='@nike'
				autoCapitalize='none'
				autoCorrect={false}
			/>
			<Spacer y={16} />
			<FormInput
				control={methods.control}
				label='Instagram username'
				name='instagram'
				placeholder='@nike'
				autoCapitalize='none'
				autoCorrect={false}
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
		</Screen>
	);
};

export default CreateStore;
