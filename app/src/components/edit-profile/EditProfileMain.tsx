import React from 'react';
import { useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { CurrentUserQuery, useEditProfileMutation } from '../../types/api';
import Button from '../global/Button';
import FormInput from '../global/FormInput';

interface EditProfileMainProps {
	currentUser: CurrentUserQuery['currentUser'];
}

interface EditProfileFormValues {
	name: string;
	phone: string;
}

const EditProfileMain: React.FC<EditProfileMainProps> = ({ currentUser }) => {
	const [, editProfile] = useEditProfileMutation();

	const { control, handleSubmit } = useForm<EditProfileFormValues>({
		defaultValues: {
			name: currentUser.name,
			phone: currentUser.phone
		}
	});

	const onSubmit = async (values: EditProfileFormValues) => {
		editProfile({ input: values });
	};

	return (
		<View style={styles.container}>
			<FormInput name='name' label='Name' control={control} />
			<FormInput name='phone' label='Phone' control={control} />
			<Button
				style={styles.button}
				text='Edit Profile'
				onPress={handleSubmit(onSubmit)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	button: {
		marginVertical: 16
	}
});

export default EditProfileMain;
