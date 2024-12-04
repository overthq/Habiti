import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';
import { useAddDeliveryAddressMutation } from '../types/api';

const AddDeliveryAddress = () => {
	const methods = useForm();
	const [, addDeliveryAddress] = useAddDeliveryAddressMutation();
	useGoBack('x');

	const onSubmit = React.useCallback(
		async (data: any) => {
			await addDeliveryAddress({ input: data });
		},
		[addDeliveryAddress]
	);

	return (
		<Screen style={{ paddingTop: 16, paddingHorizontal: 16 }}>
			<FormProvider {...methods}>
				<FormInput name='name' control={methods.control} label='Name' />
				<Spacer y={16} />
				<Button onPress={methods.handleSubmit(onSubmit)} text='Add Address' />
			</FormProvider>
		</Screen>
	);
};

export default AddDeliveryAddress;
