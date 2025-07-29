import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen, Spacer, FormInput, Button } from '@habiti/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useForm, FormProvider } from 'react-hook-form';

import { useVerifyBankAccountMutation } from '../types/api';
import { EditPayoutInfoFormValues } from '../types/forms';
import BankSelectButton from '../components/store-payouts/BankSelectButton';
import BankSelectModal from '../components/store-payouts/BankSelectModal';
import ConfirmationModal from '../components/store-payouts/ConfirmationModal';
import useGoBack from '../hooks/useGoBack';

const AddPayoutAccount = () => {
	const [{ data }, verifyBankAccount] = useVerifyBankAccountMutation();

	const selectModalRef = React.useRef<BottomSheetModal>(null);
	const confirmationModalRef = React.useRef<BottomSheetModal>(null);

	useGoBack('x');

	const methods = useForm<EditPayoutInfoFormValues>({
		defaultValues: {
			accountNumber: '',
			bank: ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: EditPayoutInfoFormValues) => {
			const { error } = await verifyBankAccount({
				input: {
					bankAccountNumber: values.accountNumber,
					bankCode: values.bank
				}
			});

			if (error) {
				console.log('error', error);
			} else {
				confirmationModalRef.current?.present();
			}
		},
		[]
	);

	const toggleSelect = React.useCallback(() => {
		selectModalRef.current?.present();
	}, []);

	return (
		<Screen style={{ paddingHorizontal: 16, paddingTop: 16 }}>
			<FormProvider {...methods}>
				<FormInput
					name='accountNumber'
					label='Account Number'
					placeholder='Account Number'
					control={methods.control}
					style={styles.input}
					keyboardType='number-pad'
				/>
				<BankSelectButton control={methods.control} onPress={toggleSelect} />
				<Spacer y={8} />
				<Button
					text='Update information'
					onPress={methods.handleSubmit(onSubmit)}
					disabled={!methods.formState.isDirty}
				/>
				<BankSelectModal modalRef={selectModalRef} />
				<ConfirmationModal
					modalRef={confirmationModalRef}
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

export default AddPayoutAccount;
