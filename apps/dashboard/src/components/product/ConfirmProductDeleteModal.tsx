import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeleteProductMutation } from '../../data/mutations';

interface ConfirmProductDeleteModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	productId: string;
}

const ConfirmProductDeleteModal: React.FC<ConfirmProductDeleteModalProps> = ({
	modalRef,
	productId
}) => {
	const { bottom } = useSafeAreaInsets();
	const deleteProductMutation = useDeleteProductMutation();

	const handleDelete = async () => {
		await deleteProductMutation.mutateAsync(productId);
		modalRef.current?.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography weight='semibold' size='large'>
					Delete Product
				</Typography>
				<Spacer y={8} />
				<Typography>
					Are you sure you want to delete this product? This action cannot be
					undone.
				</Typography>
				<Spacer y={8} />
				<Button text='Delete' onPress={handleDelete} />
			</BottomSheetView>
		</BottomModal>
	);
};

export default ConfirmProductDeleteModal;
