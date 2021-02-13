import React from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	FlatList,
	Dimensions
} from 'react-native';
import { Formik, useFormikContext } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateStoreMutation } from '../types/api';
import authStyles from '../styles/auth';

const { width } = Dimensions.get('window');

const steps = [
	{
		title: 'Your brand',
		description: '',
		fields: [
			{
				name: 'name',
				placeholder: 'Market',
				label: 'Store name'
			},
			{
				name: 'shortName',
				placeholder: 'market',
				label: 'Store short name'
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
				label: 'Twitter username'
			},
			{
				name: 'instagram',
				placeholder: '@storename',
				label: 'Instagram username'
			},
			{
				name: 'website',
				placeholder: 'https://storename.com',
				label: 'Website URL'
			}
		]
	}
];

interface FormStepProps {
	step: typeof steps[-1];
}

const FormStep: React.FC<FormStepProps> = ({ step }) => {
	const { handleChange, handleBlur } = useFormikContext();

	return (
		<View style={styles.formStep}>
			<Text style={styles.title}>{step.title}</Text>
			{step.fields.map(({ name, placeholder, label }) => (
				<View key={name}>
					<Text style={authStyles.inputLabel}>{label}</Text>
					<TextInput
						style={authStyles.input}
						placeholder={placeholder}
						onChangeText={handleChange(name)}
						onBlur={handleBlur('name')}
					/>
				</View>
			))}
		</View>
	);
};

const CreateStore: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	// const [activeStepIndex, setActiveStepIndex] = React.useState(0);

	// const handleSubmit = (values) => {
	// };

	return (
		<SafeAreaView style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					shortName: '',
					twitter: '',
					instagram: '',
					website: ''
				}}
				onSubmit={values => {
					createStore({
						input: { name: values.name, short_name: values.shortName }
					});
					console.log('Doing something');
				}}
			>
				{() => (
					<FlatList
						horizontal
						decelerationRate='fast'
						snapToInterval={width}
						showsHorizontalScrollIndicator={false}
						data={steps}
						keyExtractor={s => s.title}
						renderItem={({ item }) => <FormStep step={item} />}
					/>
				)}
			</Formik>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		marginBottom: 16
	},
	description: {
		fontSize: 16
	},
	input: {
		fontSize: 16,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#D3D3D3',
		paddingLeft: 8,
		height: 40
	},
	formStep: {
		width,
		paddingHorizontal: 16
	}
});

export default CreateStore;
