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
						<View style={styles.field}>
							<TextInput
								style={styles.input}
								value={values.name}
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
							/>
						</View>
						<View style={styles.field}>
							<TextInput
								style={styles.input}
								placeholder='Description'
								value={values.description}
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								multiline
								textAlignVertical='top'
							/>
						</View>
						<Button
							style={styles.button}
							text='Edit store'
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
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	field: {
		marginTop: 8
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		marginBottom: 4
	},
	input: {
		width: '100%',
		height: 40,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		paddingLeft: 8,
		fontSize: 16
	},
	button: {
		marginVertical: 16
	}
});

export default EditStore;
