import React from 'react';
import { View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Typography from '../global/Typography';
import { useEditStoreMutation } from '../../types/api';
import Button from '../global/Button';
import { useFormContext } from 'react-hook-form';
import useTheme from '../../hooks/useTheme';

interface ConfirmationModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	fetching: boolean;
	accountName?: string;
}

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	modalRef,
	fetching,
	accountName
}) => {
	const [, editStore] = useEditStoreMutation();
	const methods = useFormContext<EditPayoutInfoValues>();

	const { theme } = useTheme();

	const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

	const handleSubmit = React.useCallback(() => {
		const { accountNumber, bank } = methods.getValues();

		editStore({
			input: { bankAccountNumber: accountNumber, bankCode: bank }
		});
	}, []);

	return (
		<BottomSheetModal
			ref={modalRef}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: '#505050' }}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			enablePanDownToClose
		>
			{fetching ? (
				<View>
					<Typography>Loading</Typography>
				</View>
			) : (
				<View>
					<Typography>Account Name: {accountName}</Typography>
					<Button text='Confirm details' onPress={handleSubmit} />
				</View>
			)}
		</BottomSheetModal>
	);
};

export default ConfirmationModal;
