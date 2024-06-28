import { Button, FormInput, Screen } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import useGoBack from '../hooks/useGoBack';
import { useCreateProductCategoryMutation } from '../types/api';

interface AddCategoryValues {
	name: string;
	description: string;
}

const AddCategory = () => {
	const [{ fetching }, addCategory] = useCreateProductCategoryMutation();
	const { goBack } = useNavigation();
	useGoBack('x');

	const { control, handleSubmit } = useForm<AddCategoryValues>({
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const onSubmit = React.useCallback(async (values: AddCategoryValues) => {
		const { error } = await addCategory({ input: values });

		if (error) {
			console.log(error);
		}

		goBack();
	}, []);

	return (
		<Screen style={styles.container}>
			<FormInput
				name='name'
				label='Category name'
				placeholder='First category'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='description'
				label='Category description'
				placeholder='First category description'
				control={control}
				textArea
				style={styles.input}
			/>
			<Button
				text='Add Category'
				onPress={handleSubmit(onSubmit)}
				style={styles.button}
				loading={fetching}
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
