import {
	Button,
	FormInput,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeOutDown
} from 'react-native-reanimated';

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

interface CreateStoreFormProps {
	hasTitle?: boolean;
	onCancel(): void;
}

const CreateStoreForm: React.FC<CreateStoreFormProps> = ({
	hasTitle,
	onCancel
}) => {
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
		<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
			{hasTitle && (
				<>
					<Typography size='large' weight='bold'>
						Create a new store
					</Typography>
					<Spacer y={8} />
				</>
			)}
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
			<Spacer y={32} />
			<Button text='Submit' onPress={methods.handleSubmit(onSubmit)} />
			<Spacer y={16} />
			<TextButton
				style={{ alignSelf: 'center' }}
				onPress={onCancel}
				variant='secondary'
			>
				Select an existing store instead?
			</TextButton>
		</Animated.View>
	);
};

export default CreateStoreForm;
