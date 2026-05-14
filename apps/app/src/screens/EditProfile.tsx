import React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { HeaderButton } from '@react-navigation/elements';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormInput, Screen, Spacer, Typography } from '@habiti/components';

import { useCurrentUserQuery } from '../data/queries';
import { useEditProfileMutation } from '../data/mutations';

import type { ProfileStackParamList } from '../navigation/types';
import type { User } from '../data/types';

interface EditProfileMainProps {
	currentUser: User;
}

interface EditProfileFormValues {
	name: string;
	email: string;
}

const EditProfile = () => {
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) return <View />;

	return <EditProfileMain currentUser={data.user} />;
};

const EditProfileMain: React.FC<EditProfileMainProps> = ({ currentUser }) => {
	const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
	const editProfile = useEditProfileMutation();

	const { control, handleSubmit, formState } = useForm<EditProfileFormValues>({
		defaultValues: {
			name: currentUser.name,
			email: currentUser.email
		}
	});

	const onSubmit = async (values: EditProfileFormValues) => {
		editProfile.mutate(values);
	};

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
	}, [formState.isDirty]);

	return (
		<Screen>
			<FormInput name='name' label='Name' control={control} />
			<Spacer y={8} />
			<FormInput name='email' label='Email address' control={control} />
		</Screen>
	);
};

export default EditProfile;
