import React from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Typography } from '@habiti/components';
import { useDeleteCardMutation } from '../../types/api';

interface DeleteCardModalProps {
	cardId: string;
	modalRef: React.RefObject<BottomSheetModal>;
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
	cardId,
	modalRef
}) => {
	const [, deleteCard] = useDeleteCardMutation();

	const handleCancel = React.useCallback(() => {
		modalRef.current?.close();
	}, []);

	const handleDeleteCard = React.useCallback(async () => {
		await deleteCard({ id: cardId });
		modalRef.current?.close();
	}, [cardId, deleteCard]);

	return (
		<BottomModal modalRef={modalRef}>
			<BottomSheetView style={{ paddingHorizontal: 16 }}>
				<Typography>Delete Card</Typography>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<Button text='Cancel' onPress={handleCancel} />
					<Button
						variant='destructive'
						text='Delete'
						onPress={handleDeleteCard}
					/>
				</View>
			</BottomSheetView>
		</BottomModal>
	);
};

export default DeleteCardModal;
