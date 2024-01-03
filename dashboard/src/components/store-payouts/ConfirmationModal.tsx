import React from 'react';
import { Text, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Typography from '../global/Typography';
import { useEditStoreMutation } from '../../types/api';
import { useFormContext } from 'react-hook-form';
import useTheme from '../../hooks/useTheme';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

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
						<Text
							style={{
								fontSize: 17,
								fontWeight: '500',
								color: theme.button['primary'].text
							}}
						>
							Confirm details
						</Text>
					</TouchableOpacity>
					{/* <Button text='Confirm details' onPress={handleSubmit} /> */}
				</View>
			)}
		</BottomSheetModal>
	);
};

export default ConfirmationModal;
