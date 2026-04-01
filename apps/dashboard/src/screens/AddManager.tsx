import { Button, Input, ScrollableScreen, Spacer } from '@habiti/components';
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
		<ScrollableScreen style={styles.container}>
			<Input
				label='E-mail address'
				placeholder='john@doe.com'
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<Spacer y={16} />
			<Button text='Submit' onPress={handleSubmit(onSubmit)} />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default AddManager;
