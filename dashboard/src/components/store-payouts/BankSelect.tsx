import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BANKS } from '../../utils/banks';
import Typography from '../global/Typography';
import useTheme from '../../hooks/useTheme';

interface BankSelectProps {
	modalRef: React.RefObject<BottomSheetModal>;
	currentBank?: string;
	setBank(bankCode: string): void;
}

const BankSelect: React.FC<BankSelectProps> = ({ modalRef, setBank }) => {
	const { theme } = useTheme();

	const handleBankSelect = React.useCallback(
		(code: string) => () => {
			console.log('Doing something');
			setBank(code);
			modalRef.current?.dismiss();
		},
		[modalRef.current]
	);

	const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

	return (
		<BottomSheetModal
			ref={modalRef}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: '#505050' }}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			enablePanDownToClose
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

export default BankSelect;
