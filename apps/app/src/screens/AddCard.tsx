import { Button, FormInput, Screen } from '@habiti/components';
import React from 'react';
import { useForm } from 'react-hook-form';

interface AddCardFormValues {
	cardNumber: string;
	cvv: string;
	expiryMonth: string;
	expiryYear: string;
}

const AddCard: React.FC = () => {
	const { control, handleSubmit } = useForm<AddCardFormValues>({
		defaultValues: {
			cardNumber: '',
			cvv: '',
			expiryMonth: '',
			expiryYear: ''
		}
	});

	const onSubmit = (values: AddCardFormValues) => {
		console.log({ values });
	};

	return (
		<Screen>
			<FormInput label='Card Number' name='cardNumber' control={control} />
			<FormInput label='Expiry Month' name='expiryMonth' control={control} />
			<FormInput label='Expiry Year' name='expiryYear' control={control} />
			<FormInput label='CVV' name='cvv' control={control} />
			<Button text='Add Card' onPress={handleSubmit(onSubmit)} />
		</Screen>
	);
};

export default AddCard;
