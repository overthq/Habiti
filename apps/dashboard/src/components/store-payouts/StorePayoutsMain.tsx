import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal
} from '@gorhom/bottom-sheet';
import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import BankSelectButton from './BankSelectButton';
import BankSelectModal from './BankSelectModal';
import ConfirmationModal from './ConfirmationModal';
import { useVerifyBankAccountMutation } from '../../types/api';
import { EditPayoutInfoFormValues } from '../../types/forms';

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

	const methods = useForm<EditPayoutInfoFormValues>({
		defaultValues: {
			accountNumber: bankAccountNumber ?? '',
			bank: bankCode ?? ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: EditPayoutInfoFormValues) => {
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

	const renderBackdrop = React.useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				pressBehavior='close'
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<Screen style={styles.container}>
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
				<BankSelectModal
					backdropComponent={renderBackdrop}
					modalRef={selectModalRef}
				/>
				<ConfirmationModal
					backdropComponent={renderBackdrop}
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
