import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FullWindowOverlay } from 'react-native-screens';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Typography, BottomModal, Spacer } from '@habiti/components';
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
	const [{ fetching }, editStore] = useEditStoreMutation();
	const methods = useFormContext<EditPayoutInfoValues>();
	const { bottom } = useSafeAreaInsets();

	const snapPoints = React.useMemo(() => ['25%'], []);

	const renderContainerComponent = React.useCallback(
		({ children }) => <FullWindowOverlay>{children}</FullWindowOverlay>,
		[]
	);

	const handleSubmit = React.useCallback(async () => {
		const { accountNumber, bank } = methods.getValues();

		const { error } = await editStore({
			input: { bankAccountNumber: accountNumber, bankCode: bank }
		});

		if (error) {
			console.log('error', error);
		} else {
			modalRef.current?.close();
		}
	}, []);

	return (
		<BottomModal
			modalRef={modalRef}
			snapPoints={snapPoints}
			containerComponent={renderContainerComponent}
		>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography weight='semibold' size='xlarge'>
					Confirm account details
				</Typography>
				<Spacer y={12} />
				<Typography>Account Name: {accountName}</Typography>
				<Spacer y={12} />
				<Button
					text='Confirm details'
					onPress={handleSubmit}
					loading={fetching}
				/>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ConfirmationModal;
