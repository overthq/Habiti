import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';

import Button from '../components/global/Button';
import { useCreateProductCategoryMutation } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import Screen from '../components/global/Screen';
import FormInput from '../components/global/FormInput';

interface AddCategoryValues {
	name: string;
	description: string;
}

const AddCategory = () => {
	const [, addCategory] = useCreateProductCategoryMutation();
	useGoBack('x');

	const { control, handleSubmit } = useForm<AddCategoryValues>({
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const onSubmit = React.useCallback((values: AddCategoryValues) => {
		addCategory({ input: values });
	}, []);

	return (
		<Screen style={styles.container}>
			<FormInput
				name='name'
				label='Category name'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='description'
				label='Category description'
				control={control}
				textArea
				style={styles.input}
			/>
			<Button
				text='Add Category'
				onPress={handleSubmit(onSubmit)}
				style={styles.button}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	input: {
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default AddCategory;
