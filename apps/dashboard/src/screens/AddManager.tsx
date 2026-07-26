import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, ScrollableScreen, Spacer } from '@habiti/components';

const AddManager = () => {
	const { handleSubmit } = useForm();

	const onSubmit = React.useCallback(() => {
		// Things
	}, []);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<Input
				autoFocus
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

export default AddManager;
