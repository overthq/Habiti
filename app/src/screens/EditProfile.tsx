import React from 'react';
import { View, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useCurrentUserQuery, useEditProfileMutation } from '../types/api';
import Button from '../components/global/Button';

const EditProfile: React.FC = () => {
	const [{ data, fetching }] = useCurrentUserQuery();
	const [, editProfile] = useEditProfileMutation();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: data.currentUser.name,
					phone: data.currentUser.phone
				}}
				onSubmit={values => {
					editProfile({ input: values });
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<TextInput
							style={styles.input}
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
						/>
						<TextInput
							style={styles.input}
							value={values.phone}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('phone')}
						/>
						<Button
							style={styles.button}
							text='Edit Profile'
							onPress={handleSubmit}
						/>
					</>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	input: {
		width: '100%',
		height: 40,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#505050',
		paddingLeft: 8
	},
	button: {
		marginVertical: 16
	}
});

export default EditProfile;
