import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import Button from '../components/global/Button';

const EditStore: React.FC = () => {
	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: '',
					website: '',
					twitter: '',
					instagram: ''
				}}
				onSubmit={values => {
					console.log(values);
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<View style={styles.field}>
							<Text style={styles.label}>Name</Text>
							<TextInput
								style={styles.input}
								placeholder='Name'
								value={values.name}
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
							/>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Website</Text>
							<TextInput
								style={styles.input}
								placeholder='https://acme.com'
								value={values.website}
								onChangeText={handleChange('website')}
								onBlur={handleBlur('website')}
							/>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Description</Text>
							<TextInput
								style={[styles.input, { height: 80 }]}
								placeholder='Description'
								value={values.description}
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								multiline
								textAlignVertical='top'
							/>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Twitter username</Text>
							<TextInput
								style={styles.input}
								placeholder='@acme_inc'
								value={values.twitter}
								onChangeText={handleChange('twitter')}
								onBlur={handleBlur('twitter')}
							/>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Instagram username</Text>
							<TextInput
								style={styles.input}
								placeholder='@acme'
								value={values.instagram}
								onChangeText={handleChange('instagram')}
								onBlur={handleBlur('instagram')}
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
