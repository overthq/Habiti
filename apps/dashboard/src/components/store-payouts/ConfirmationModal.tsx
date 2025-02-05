import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme, Button, Typography, BottomModal } from '@habiti/components';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useEditStoreMutation } from '../../types/api';

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

	const snapPoints = React.useMemo(() => ['25%'], []);

	const handleSubmit = React.useCallback(() => {
		const { accountNumber, bank } = methods.getValues();

		editStore({
			input: { bankAccountNumber: accountNumber, bankCode: bank }
		});
	}, []);

	return (
		<BottomModal modalRef={modalRef} snapPoints={snapPoints}>
			{fetching ? (
				<Typography>Loading</Typography>
			) : (
				<>
					<Typography>Account Name: {accountName}</Typography>
					<Button text='Confirm details' onPress={handleSubmit} />
				</>
			)}
		</BottomModal>
	);
};

export default ConfirmationModal;
