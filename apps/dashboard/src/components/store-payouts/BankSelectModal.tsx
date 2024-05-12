import {
	BottomSheetBackdropProps,
	BottomSheetFlatList,
	BottomSheetModal
} from '@gorhom/bottom-sheet';
import { useTheme, Typography } from '@market/components';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';

import { BANKS } from '../../utils/banks';

interface BankSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	backdropComponent: React.FC<BottomSheetBackdropProps>;
	currentBank?: string;
}

const BankSelectModal: React.FC<BankSelectModalProps> = ({
	modalRef,
	backdropComponent
}) => {
	const { theme } = useTheme();

	const dismissModal = React.useCallback(() => {
		modalRef.current?.dismiss();
	}, [modalRef.current]);

	const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

	return (
		<Controller
			name='bank'
			render={({ field }) => (
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
							<Pressable
								style={styles.row}
								onPress={() => {
									field.onChange(item.code);
									dismissModal();
								}}
							>
								<Typography>{item.name}</Typography>
							</Pressable>
						)}
					/>
				</BottomSheetModal>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	row: {
		paddingHorizontal: 16,
		paddingVertical: 4
	}
});

export default BankSelectModal;
