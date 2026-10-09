import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, ScrollableScreen, Spacer } from '@habiti/components';

import useHeaderSubmit from '../hooks/useHeaderSubmit';

const AddManager = () => {
	const { handleSubmit } = useForm();

	const onSubmit = React.useCallback(() => {
		// Things
	}, []);

	useHeaderSubmit({ onSubmit: handleSubmit(onSubmit) });

	return (
		<ScrollableScreen withToolbar>
			<Spacer y={16} />
			<Input
				autoFocus
				label='E-mail address'
				placeholder='john@doe.com'
				keyboardType='email-address'
				autoCapitalize='none'
			/>
		</ScrollableScreen>
	);
};

export default AddManager;
