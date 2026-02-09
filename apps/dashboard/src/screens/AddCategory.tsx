import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, FormInput, Screen } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import { useCreateProductCategoryMutation } from '../data/mutations';

interface AddCategoryValues {
	name: string;
	description: string;
}

const AddCategory = () => {
	const createProductCategoryMutation = useCreateProductCategoryMutation();
	const { goBack } = useNavigation();
	useGoBack('x');

	const { control, handleSubmit } = useForm<AddCategoryValues>({
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const onSubmit = React.useCallback(async (values: AddCategoryValues) => {
		await createProductCategoryMutation.mutateAsync(values);

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
				loading={createProductCategoryMutation.isPending}
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
