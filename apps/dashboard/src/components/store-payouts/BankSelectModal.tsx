import {
	BottomSheetBackdropProps,
	BottomSheetFlatList,
	BottomSheetModal
} from '@gorhom/bottom-sheet';
import { useTheme, Typography, Spacer, Row } from '@habiti/components';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { BANKS } from '../../utils/banks';

interface BankSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	backdropComponent: React.FC<BottomSheetBackdropProps>;
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
					backgroundStyle={{ backgroundColor: theme.screen.background }}
					handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
					enablePanDownToClose
					backdropComponent={backdropComponent}
				>
					<Spacer y={8} />
					<Typography style={{ paddingLeft: 16 }} weight='medium' size='large'>
						Choose your bank
					</Typography>
					<Spacer y={8} />
					<BottomSheetFlatList
						data={BANKS}
						keyExtractor={b => b.id.toString()}
						renderItem={({ item }) => (
							<Row
								style={styles.row}
								onPress={() => {
									field.onChange(item.code);
									dismissModal();
								}}
							>
								<Typography>{item.name}</Typography>
							</Row>
						)}
					/>
				</BottomSheetModal>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	row: {
		paddingVertical: 8
	}
});

export default BankSelectModal;
