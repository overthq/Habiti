import {
	BottomSheetBackdropProps,
	BottomSheetFlatList,
	BottomSheetModal
} from '@gorhom/bottom-sheet';
import { useTheme, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { BANKS } from '../../utils/banks';

interface BankSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	backdropComponent: React.FC<BottomSheetBackdropProps>;
	currentBank?: string;
	setBank(bankCode: string): void;
}

const BankSelectModal: React.FC<BankSelectModalProps> = ({
	modalRef,
	backdropComponent,
	setBank
}) => {
	const { theme } = useTheme();

	const handleBankSelect = React.useCallback(
		(code: string) => () => {
			setBank(code);
			modalRef.current?.dismiss();
		},
		[modalRef.current]
	);

	const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

	return (
		<BottomSheetModal
			index={0}
			ref={modalRef}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: '#505050' }}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			enablePanDownToClose
			backdropComponent={backdropComponent}
		>
			<BottomSheetFlatList
				data={BANKS}
				keyExtractor={b => b.id.toString()}
				renderItem={({ item }) => (
					<Pressable style={styles.row} onPress={handleBankSelect(item.code)}>
						<Typography>{item.name}</Typography>
					</Pressable>
				)}
				// contentContainerStyle={{ backgroundColor: theme.screen.background }}
			/>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	row: {
		paddingHorizontal: 16,
		paddingVertical: 4
	}
});

export default BankSelectModal;
