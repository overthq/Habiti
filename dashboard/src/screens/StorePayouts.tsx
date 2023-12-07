import React from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../components/global/Screen';
import Input from '../components/global/Input';
import Button from '../components/global/Button';
import useGoBack from '../hooks/useGoBack';
import { useForm } from 'react-hook-form';
import FormInput from '../components/global/FormInput';

// What settings should store owners be able to control from here?
// Account settings (account number, bank)
// Generate account name from these details

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

const StorePayouts = () => {
	const [mode, setMode] = React.useState<'fetch' | 'submit'>('fetch');
	const { control, handleSubmit } = useForm<EditPayoutInfoValues>();
	useGoBack();

	const onSubmit = React.useCallback((values: EditPayoutInfoValues) => {
		// TODO: Handle editing of details
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
