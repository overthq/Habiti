import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
	ScrollableScreen,
	Spacer,
	FormInput,
	Button
} from '@habiti/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useForm, FormProvider } from 'react-hook-form';

import { useVerifyBankAccountMutation } from '../data/mutations';
import { EditPayoutInfoFormValues } from '../types/forms';
import BankSelectButton from '../components/store-payouts/BankSelectButton';
import BankSelectModal from '../components/store-payouts/BankSelectModal';
import ConfirmationModal from '../components/store-payouts/ConfirmationModal';
import useGoBack from '../hooks/useGoBack';

const AddPayoutAccount = () => {
	const verifyBankAccountMutation = useVerifyBankAccountMutation();

	const inputRef = React.useRef<TextInput>(null);
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
			inputRef.current?.blur();

			await verifyBankAccountMutation.mutateAsync({
				bankAccountNumber: values.accountNumber,
				bankCode: values.bank
			});

			confirmationModalRef.current?.present();
		},
		[]
	);

	const toggleSelect = React.useCallback(() => {
		inputRef.current?.blur();
		selectModalRef.current?.present();
	}, []);

	return (
		<ScrollableScreen style={{ paddingHorizontal: 16, paddingTop: 16 }}>
			<FormProvider {...methods}>
				<FormInput
					ref={inputRef}
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
					accountName={verifyBankAccountMutation.data?.accountName}
				/>
			</FormProvider>
		</ScrollableScreen>
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
