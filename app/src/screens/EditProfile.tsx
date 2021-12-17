import React from 'react';
import { View, ActivityIndicator, TextInput } from 'react-native';
import { Formik } from 'formik';
import { useCurrentUserQuery } from '../types/api';

const EditProfile: React.FC = () => {
	const [{ data, fetching }] = useCurrentUserQuery();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<Formik
				initialValues={{
					name: data.currentUser.name,
					phone: data.currentUser.phone
				}}
				onSubmit={values => {
					console.log(values);
				}}
			>
				<TextInput />
				<TextInput />
			</Formik>
		</View>
	);
};

export default EditProfile;
