import React from 'react';
import { StyleSheet } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Screen from '../global/Screen';
import FormInput from '../global/FormInput';
import Button from '../global/Button';
import { useVerifyBankAccountMutation } from '../../types/api';
import BankSelectModal from './BankSelectModal';
import BankSelectButton from './BankSelectButton';
import ConfirmationModal from './ConfirmationModal';

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
	const [{ fetching, data }, verifyBankAccount] =
		useVerifyBankAccountMutation();

	const selectModalRef = React.useRef<BottomSheetModal>(null);
	const confirmationModalRef = React.useRef<BottomSheetModal>(null);

	const methods = useForm<EditPayoutInfoValues>({
		defaultValues: {
			accountNumber: bankAccountNumber ?? '',
			bank: bankCode ?? ''
		}
	});

	const { control, setValue, handleSubmit } = methods;

	const handleSetBank = React.useCallback((code: string) => {
		setValue('bank', code);
	}, []);

	const onSubmit = React.useCallback(
		async (values: EditPayoutInfoValues) => {
			verifyBankAccount({
				input: {
					bankAccountNumber: values.accountNumber,
					bankCode: values.bank
				}
			});
			confirmationModalRef.current?.present();
		},
		[confirmationModalRef.current]
	);

	const toggleSelect = React.useCallback(() => {
		selectModalRef.current?.present();
	}, []);

	return (
		<Screen style={styles.container}>
			<FormProvider {...methods}>
				<FormInput
					name='accountNumber'
					label='Account Number'
					control={control}
					style={styles.input}
					keyboardType='number-pad'
				/>
				<BankSelectButton control={control} onPress={toggleSelect} />
				<Button text='Update information' onPress={handleSubmit(onSubmit)} />
				<BankSelectModal modalRef={selectModalRef} setBank={handleSetBank} />
				<ConfirmationModal
					modalRef={confirmationModalRef}
					fetching={fetching}
					accountName={data?.verifyBankAccount?.accountName}
				/>
			</FormProvider>
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
