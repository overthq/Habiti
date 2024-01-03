import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import Screen from '../components/global/Screen';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Input from '../components/global/Input';

const AddManager = () => {
	useGoBack('x');

	const { handleSubmit } = useForm();

	const onSubmit = React.useCallback(() => {
		// Things
	}, []);

	return (
		<Screen style={styles.container}>
			<Input
				label='E-mail address'
				placeholder='john@doe.com'
				style={styles.input}
			/>
			<Button text='Submit' onPress={handleSubmit(onSubmit)} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	input: {
		marginBottom: 8
	}
});

export default AddManager;
