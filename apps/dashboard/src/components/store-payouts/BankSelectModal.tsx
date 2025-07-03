import React from 'react';
import { Controller } from 'react-hook-form';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	Typography,
	Spacer,
	Row,
	BottomModal,
	useTheme
} from '@habiti/components';

import { BANKS } from '../../utils/banks';

interface BankSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const BankSelectModal: React.FC<BankSelectModalProps> = ({ modalRef }) => {
	const { theme } = useTheme();

	const dismissModal = React.useCallback(() => {
		modalRef.current?.dismiss();
	}, [modalRef.current]);

	const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

	return (
		<Controller
			name='bank'
			render={({ field }) => (
				<BottomModal modalRef={modalRef} snapPoints={snapPoints}>
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
								style={{ backgroundColor: theme.modal.background }}
								onPress={() => {
									field.onChange(item.code);
									dismissModal();
								}}
							>
								<Typography>{item.name}</Typography>
							</Row>
						)}
					/>
				</BottomModal>
			)}
		/>
	);
};

export default BankSelectModal;
