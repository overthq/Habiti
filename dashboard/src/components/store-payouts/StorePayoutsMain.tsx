import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import Screen from '../global/Screen';
import FormInput from '../global/FormInput';
import Input from '../global/Input';
import Button from '../global/Button';
import { useEditStoreMutation } from '../../types/api';

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

interface StorePayoutsMainProps {
	bankAccountNumber?: string | null;
	bankCode?: string | null;
}

const StorePayoutsMain: React.FC<StorePayoutsMainProps> = ({
	bankAccountNumber,
	bankCode
}) => {
	const [, editStore] = useEditStoreMutation();
	const { control, handleSubmit } = useForm<EditPayoutInfoValues>({
		defaultValues: {
			accountNumber: bankAccountNumber ?? '',
			bank: bankCode ?? ''
		}
	});

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

export default StorePayoutsMain;
