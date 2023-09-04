import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import FormInput from '../global/FormInput';
import { CurrentUserQuery, useEditProfileMutation } from '../../types/api';
import TextButton from '../global/TextButton';

interface EditProfileMainProps {
	currentUser: CurrentUserQuery['currentUser'];
}

interface EditProfileFormValues {
	name: string;
	phone: string;
}

const EditProfileMain: React.FC<EditProfileMainProps> = ({ currentUser }) => {
	const navigation = useNavigation();
	const [, editProfile] = useEditProfileMutation();

	const { control, handleSubmit, formState } = useForm<EditProfileFormValues>({
		defaultValues: {
			name: currentUser.name,
			phone: currentUser.phone
		}
	});

	const onSubmit = async (values: EditProfileFormValues) => {
		editProfile({ input: values });
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TextButton
					onPress={handleSubmit(onSubmit)}
					disabled={!formState.isDirty}
				>
					Save
				</TextButton>
			)
		});
	}, [formState.isDirty]);

	return (
		<View style={styles.container}>
			<FormInput
				name='name'
				label='Name'
				control={control}
				style={styles.input}
			/>
			<FormInput name='phone' label='Phone' control={control} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingTop: 8,
		paddingHorizontal: 16
	},
	input: {
		marginBottom: 8
	},
	saveButton: {
		marginRight: 16
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: '400'
	}
});

export default EditProfileMain;
