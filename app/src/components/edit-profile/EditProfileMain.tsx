import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import FormInput from '../global/FormInput';
import { CurrentUserQuery, useEditProfileMutation } from '../../types/api';

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
				<Pressable
					style={{ marginRight: 16 }}
					onPress={handleSubmit(onSubmit)}
					disabled={!formState.isDirty}
				>
					<Text
						style={[
							{ fontSize: 16, fontWeight: '400' },
							!formState.isDirty ? { color: '#777777' } : {}
						]}
					>
						Save
					</Text>
				</Pressable>
			)
		});
	}, [formState.isDirty]);

	return (
		<View style={styles.container}>
			<FormInput name='name' label='Name' control={control} />
			<FormInput name='phone' label='Phone' control={control} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16
	},
	button: {
		marginVertical: 16
	}
});

export default EditProfileMain;
