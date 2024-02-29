import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';

import Button from '../components/global/Button';
import { useCreateProductCategoryMutation } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import Screen from '../components/global/Screen';
import FormInput from '../components/global/FormInput';
import { useNavigation } from '@react-navigation/native';

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
		try {
			await addCategory({ input: values });
			goBack();
		} catch (error) {
			console.log(error);
		}
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
