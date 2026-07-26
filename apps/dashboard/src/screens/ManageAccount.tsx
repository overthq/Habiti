import React from 'react';
import { Alert, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { HeaderButton } from '@react-navigation/elements';
import {
	Button,
	FormInput,
	Screen,
	Separator,
	Spacer,
	Typography
} from '@habiti/components';

import { useCurrentUserQuery } from '../data/queries';
import {
	useDeleteAccountMutation,
	useEditProfileMutation
} from '../data/mutations';

import type { ProfileStackScreenProps } from '../navigation/types';
import type { User } from '../data/types';

const ManageAccount: React.FC<ProfileStackScreenProps<'ManageAccount'>> = ({
	navigation
}) => {
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) return <View />;

	return <ManageAccountMain navigation={navigation} currentUser={data.user} />;
};

interface ManageAccountMainProps {
	navigation: ProfileStackScreenProps<'ManageAccount'>['navigation'];
	currentUser: User;
}

interface ManageAccountFormValues {
	name: string;
	email: string;
}

const ManageAccountMain: React.FC<ManageAccountMainProps> = ({
	navigation,
	currentUser
}) => {
	const editProfile = useEditProfileMutation();
	const { mutate: deleteAccount } = useDeleteAccountMutation();

	const { control, handleSubmit, formState } = useForm<ManageAccountFormValues>(
		{
			defaultValues: {
				name: currentUser.name,
				email: currentUser.email ?? ''
			}
		}
	);

	const onSubmit = React.useCallback(
		async (values: ManageAccountFormValues) => {
			editProfile.mutate(values);
		},
		[editProfile]
	);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton
					onPress={handleSubmit(onSubmit)}
					disabled={!formState.isDirty}
				>
					<Typography>Save</Typography>
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Save',
					onPress: handleSubmit(onSubmit),
					disabled: !formState.isDirty
				}
			]
		});
	}, [navigation, handleSubmit, onSubmit, formState.isDirty]);

	const handleDeleteAccount = React.useCallback(() => {
		Alert.alert(
			'Delete Account',
			'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => deleteAccount()
				}
			]
		);
	}, [deleteAccount]);

	return (
		<Screen>
			<Spacer y={16} />

			<FormInput name='name' label='Name' control={control} />

			<Spacer y={12} />

			<FormInput name='email' label='Email address' control={control} />

			<Spacer y={24} />

			<Separator />

			<Spacer y={24} />

			<Button
				text='Delete Account'
				onPress={handleDeleteAccount}
				variant='destructive'
			/>

			<Spacer y={8} />

			<Typography variant='secondary' size='small'>
				Deleting your account will permanently remove all your data, including
				your stores, products, and order history.
			</Typography>
		</Screen>
	);
};

export default ManageAccount;
