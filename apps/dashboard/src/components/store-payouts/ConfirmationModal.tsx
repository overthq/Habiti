import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FullWindowOverlay } from 'react-native-screens';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Typography, BottomModal } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEditStoreMutation } from '../../types/api';

interface ConfirmationModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	accountName?: string;
}

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	modalRef,
	accountName
}) => {
	const [, editStore] = useEditStoreMutation();
	const methods = useFormContext<EditPayoutInfoValues>();
	const { bottom } = useSafeAreaInsets();

	const snapPoints = React.useMemo(() => ['25%'], []);

	const renderContainerComponent = React.useCallback(
		({ children }) => <FullWindowOverlay>{children}</FullWindowOverlay>,
		[]
	);

	const handleSubmit = React.useCallback(() => {
		const { accountNumber, bank } = methods.getValues();

		editStore({
			input: { bankAccountNumber: accountNumber, bankCode: bank }
		});
	}, []);

	return (
		<BottomModal
			modalRef={modalRef}
			snapPoints={snapPoints}
			containerComponent={renderContainerComponent}
		>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography>Account Name: {accountName}</Typography>
				<Button text='Confirm details' onPress={handleSubmit} />
			</BottomSheetView>
		</BottomModal>
	);
};

export default ConfirmationModal;
