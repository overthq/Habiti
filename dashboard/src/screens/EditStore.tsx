import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import Button from '../components/global/Button';

const EditStore: React.FC = () => {
	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: ''
				}}
				onSubmit={values => {
					console.log(values);
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<TextInput
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
						/>
						<Button text='Edit store' onPress={handleSubmit} />
					</>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default EditStore;
