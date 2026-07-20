import React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { HeaderButton } from '@react-navigation/elements';
import { FormInput, Screen, Spacer, Typography } from '@habiti/components';

import { useCurrentUserQuery } from '../data/queries';
import { useEditProfileMutation } from '../data/mutations';

import type { ProfileStackScreenProps } from '../navigation/types';
import type { User } from '../data/types';

interface EditProfileMainProps {
	navigation: ProfileStackScreenProps<'EditProfile'>['navigation'];
	currentUser: User;
}

interface EditProfileFormValues {
	name: string;
	email: string;
}

const EditProfile: React.FC<ProfileStackScreenProps<'EditProfile'>> = ({
	navigation
}) => {
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) return <View />;

	return <EditProfileMain navigation={navigation} currentUser={data.user} />;
};

const EditProfileMain: React.FC<EditProfileMainProps> = ({
	navigation,
	currentUser
}) => {
	const editProfile = useEditProfileMutation();

	const { control, handleSubmit, formState } = useForm<EditProfileFormValues>({
		defaultValues: {
			name: currentUser.name,
			email: currentUser.email ?? ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: EditProfileFormValues) => {
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

	return (
		<Screen>
			<Spacer y={16} />
			<FormInput name='name' label='Name' control={control} />
			<Spacer y={8} />
			<FormInput name='email' label='Email address' control={control} />
		</Screen>
	);
};

export default EditProfile;
