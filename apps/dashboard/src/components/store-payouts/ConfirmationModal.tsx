import {
	BottomSheetBackdropProps,
	BottomSheetModal,
	TouchableOpacity
} from '@gorhom/bottom-sheet';
import { useTheme, Typography } from '@market/components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { useEditStoreMutation } from '../../types/api';

interface ConfirmationModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	backdropComponent: React.FC<BottomSheetBackdropProps>;
	fetching: boolean;
	accountName?: string;
}

interface EditPayoutInfoValues {
	accountNumber: string;
	bank: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	modalRef,
	backdropComponent,
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
		<BottomSheetModal
			index={0}
			ref={modalRef}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: '#505050' }}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			backdropComponent={backdropComponent}
			enablePanDownToClose
		>
			{fetching ? (
				<View>
					<Typography>Loading</Typography>
				</View>
			) : (
				<View style={{ flex: 1, padding: 8 }}>
					<Typography>Account Name: {accountName}</Typography>
					<TouchableOpacity
						activeOpacity={1}
						onPress={handleSubmit}
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							height: 45,
							maxHeight: 45,
							borderRadius: 4,
							backgroundColor: theme.button['primary'].background
						}}
					>
						<Typography
							weight='medium'
							style={{ color: theme.button['primary'].text }}
						>
							Confirm details
						</Typography>
					</TouchableOpacity>
					{/* <Button text='Confirm details' onPress={handleSubmit} /> */}
				</View>
			)}
		</BottomSheetModal>
	);
};

export default ConfirmationModal;
