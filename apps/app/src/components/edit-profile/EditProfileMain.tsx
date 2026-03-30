import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { FormInput, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import { useEditProfileMutation } from '../../data/mutations';
import { User } from '../../data/types';
import { ProfileStackParamList } from '../../types/navigation';

interface EditProfileMainProps {
	currentUser: User;
}

interface EditProfileFormValues {
	name: string;
	email: string;
}

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
			)
		});
	}, [formState.isDirty]);

	return (
		<Screen style={styles.container}>
			<FormInput
				name='name'
				label='Name'
				control={control}
				style={styles.input}
			/>
			<FormInput name='email' label='Email address' control={control} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	input: {
		marginBottom: 8
	}
});

export default EditProfileMain;
