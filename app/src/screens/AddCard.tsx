import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';

import Button from '../components/global/Button';
import FormInput from '../components/global/FormInput';

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
		<View style={styles.container}>
			<FormInput label='Card Number' name='cardNumber' control={control} />
			<FormInput label='Expiry Month' name='expiryMonth' control={control} />
			<FormInput label='Expiry Year' name='expiryYear' control={control} />
			<FormInput label='CVV' name='cvv' control={control} />
			<Button text='Add Card' onPress={handleSubmit(onSubmit)} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default AddCard;
