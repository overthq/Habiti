import React from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
	Button,
	FormInput,
	ScrollableScreen,
	Spacer
} from '@habiti/components';

import useStore from '../state';
import { useCreateStoreMutation } from '../data/mutations';
import { useShallow } from 'zustand/react/shallow';

export interface CreateStoreFormValues {
	name: string;
	description: string;
}

const CreateStore = () => {
	const createStoreMutation = useCreateStoreMutation();
	const setPreference = useStore(useShallow(state => state.setPreference));
	const methods = useForm<CreateStoreFormValues>();
	const { bottom } = useSafeAreaInsets();
	const { goBack } = useNavigation();

	const onSubmit = React.useCallback(
		async (values: CreateStoreFormValues) => {
			const { store } = await createStoreMutation.mutateAsync(values);

			setPreference({ activeStore: store.id });
			goBack();
		},
		[setPreference, createStoreMutation]
	);

	return (
		<ScrollableScreen style={{ padding: 16, paddingBottom: bottom }}>
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
