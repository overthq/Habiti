import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import {
	Button,
	FormInput,
	ScrollableScreen,
	Spacer
} from '@habiti/components';

import { useCreateProductCategoryMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';

interface AddCategoryValues {
	name: string;
	description: string;
}

const AddCategory: React.FC<AppStackScreenProps<'Modal.AddCategory'>> = ({
	navigation
}) => {
	const createProductCategoryMutation = useCreateProductCategoryMutation();

	const { control, handleSubmit } = useForm<AddCategoryValues>({
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: AddCategoryValues) => {
			await createProductCategoryMutation.mutateAsync(values);

			navigation.goBack();
		},
		[createProductCategoryMutation, navigation]
	);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
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
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	input: {
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default AddCategory;
