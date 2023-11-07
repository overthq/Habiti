import React from 'react';
import { StyleSheet } from 'react-native';

import Button from '../components/global/Button';
import { useCreateProductCategoryMutation } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import Input from '../components/global/Input';
import Screen from '../components/global/Screen';

const AddCategory = () => {
	const [, addCategory] = useCreateProductCategoryMutation();
	useGoBack('x');

	const handleSubmit = React.useCallback(async () => {
		addCategory({ input: { name: '' } });
	}, []);

	return (
		<Screen style={styles.container}>
			<Input label='Category name' style={styles.input} />
			<Input label='Category description' textArea style={styles.input} />
			<Button
				text='Add Category'
				onPress={handleSubmit}
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
