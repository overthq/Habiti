import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { Formik, useFormikContext } from 'formik';

const steps = [
	{
		title: 'Your brand',
		description: '',
		fields: [
			{
				name: 'name',
				placeholder: '',
				label: ''
			},
			{
				name: 'shortName',
				placeholder: '',
				label: ''
			}
		]
	},
	{
		title: 'Your online presence',
		description: '',
		fields: [
			{
				name: 'twitter',
				placeholder: '@storename',
				label: ''
			},
			{
				name: 'instagram',
				placeholder: '@storename',
				label: ''
			},
			{
				name: 'website',
				placeholder: 'https://storename.com',
				label: ''
			}
		]
	}
];

const renderFormStep = (step: typeof steps[-1]) => {
	const { handleChange, handleBlur } = useFormikContext();

	return (
		<View>
			<Text>{step.title}</Text>
			{step.fields.map(({ name, placeholder, label }) => (
				<View key={name}>
					<Text>{label}</Text>
					<TextInput
						placeholder={placeholder}
						onChangeText={handleChange(name)}
						onBlur={handleBlur('name')}
					/>
				</View>
			))}
		</View>
	);
};

const CreateStore = () => {
	const handleSubmit = () => {
		console.log('Doing something');
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					shortName: '',
					twitter: '',
					instagram: '',
					website: ''
				}}
				onSubmit={handleSubmit}
			>
				{() => (
					<FlatList
						data={steps}
						keyExtractor={s => s.title}
						renderItem={({ item }) => renderFormStep(item)}
					/>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {},
	description: {}
});

export default CreateStore;
