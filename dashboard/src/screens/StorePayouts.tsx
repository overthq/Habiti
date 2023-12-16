import React from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../components/global/Screen';
import Input from '../components/global/Input';
import Button from '../components/global/Button';
import useGoBack from '../hooks/useGoBack';
import { useForm } from 'react-hook-form';
import FormInput from '../components/global/FormInput';
import { useEditStoreMutation } from '../types/api';

// What settings should store owners be able to control from here?
// Account settings (account number, bank)
// Generate account name from these details

// Do we want to store the reference information from Paystack alone,
// or the reference data and actual bank account information
// i.e. account number and bank code.

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

const StorePayouts = () => {
	const { control, handleSubmit } = useForm<EditPayoutInfoValues>();
	const [, editStore] = useEditStoreMutation();
	useGoBack();

	const onSubmit = React.useCallback((values: EditPayoutInfoValues) => {
		editStore({
			input: { bankAccountNumber: values.accountNumber, bankCode: values.bank }
		});
	}, []);

	return (
		<Screen style={styles.container}>
			<FormInput
				name='accountNumber'
				label='Account Number'
				control={control}
				style={styles.input}
			/>
			<Input style={styles.input} label='Bank' />
			<Button text='Update information' onPress={handleSubmit(onSubmit)} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	input: {
		marginBottom: 8
	}
});

export default StorePayouts;
