import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import Screen from '../global/Screen';
import FormInput from '../global/FormInput';
import Input from '../global/Input';
import Button from '../global/Button';
import { useEditStoreMutation } from '../../types/api';
import BankSelect from './BankSelect';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

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
	// const [selectOpen, toggleSelect] = React.useReducer(s => !s, false);
	const { control, handleSubmit } = useForm<EditPayoutInfoValues>({
		defaultValues: {
			accountNumber: bankAccountNumber ?? '',
			bank: bankCode ?? ''
		}
	});

	// TODO: Switch this
	const [code, setBankCode] = React.useState<string>();
	const selectModalRef = React.useRef<BottomSheetModal>(null);

	const onSubmit = React.useCallback((values: EditPayoutInfoValues) => {
		editStore({
			input: { bankAccountNumber: values.accountNumber, bankCode: values.bank }
		});
	}, []);

	const toggleSelect = React.useCallback(() => {
		selectModalRef.current?.present();
	}, []);

	return (
		<Screen style={styles.container}>
			<FormInput
				name='accountNumber'
				label='Account Number'
				control={control}
				style={styles.input}
				keyboardType='number-pad'
			/>
			<Input style={styles.input} label='Bank' />
			<Button onPress={toggleSelect} text='Open toggle' />
			<Button text='Update information' onPress={handleSubmit(onSubmit)} />
			<BankSelect modalRef={selectModalRef} setBank={setBankCode} />
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
