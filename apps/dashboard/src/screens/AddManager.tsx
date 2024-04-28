import { Button, Input, Screen, Spacer } from '@market/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import useGoBack from '../hooks/useGoBack';

const AddManager = () => {
	useGoBack('x');

	const { handleSubmit } = useForm();

	const onSubmit = React.useCallback(() => {
		// Things
	}, []);

	return (
		<Screen style={styles.container}>
			<Input label='E-mail address' placeholder='john@doe.com' />
			<Spacer y={16} />
			<Button text='Submit' onPress={handleSubmit(onSubmit)} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default AddManager;
