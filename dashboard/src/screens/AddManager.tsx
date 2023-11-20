import React from 'react';
import { useForm } from 'react-hook-form';
import Screen from '../components/global/Screen';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';

const AddManager = () => {
	useGoBack('x');

	const { handleSubmit } = useForm();

	const onSubmit = React.useCallback(() => {
		// Things
	}, []);

	return (
		<Screen>
			<Button text='Submit' onPress={handleSubmit(onSubmit)} />
		</Screen>
	);
};

export default AddManager;
