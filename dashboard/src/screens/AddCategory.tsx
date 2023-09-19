import React from 'react';
import { View, StyleSheet } from 'react-native';

import Button from '../components/global/Button';
import { useCreateProductCategoryMutation } from '../types/api';

const AddCategory = () => {
	const [, addCategory] = useCreateProductCategoryMutation();

	const handleSubmit = React.useCallback(async () => {
		addCategory({ input: { name: '' } });
	}, []);

	return (
		<View style={styles.container}>
			<Button text='Add Category' onPress={handleSubmit} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default AddCategory;
