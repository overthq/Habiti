import React from 'react';
import { View, StyleSheet } from 'react-native';

import Button from '../components/global/Button';
import { useCreateProductCategoryMutation } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import Input from '../components/global/Input';

const AddCategory = () => {
	const [, addCategory] = useCreateProductCategoryMutation();
	useGoBack('x');

	const handleSubmit = React.useCallback(async () => {
		addCategory({ input: { name: '' } });
	}, []);

	return (
		<View style={styles.container}>
			<Input label='Category name' style={styles.input} />
			<Input label='Category description' textArea style={styles.input} />
			<Button
				text='Add Category'
				onPress={handleSubmit}
				style={styles.button}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
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
