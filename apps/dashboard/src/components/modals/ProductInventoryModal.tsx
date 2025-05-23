import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';
import { useEditProductMutation } from '../../types/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductInventoryModalProps {
	productId: string;
	initialQuantity: number;
	modalRef: React.RefObject<BottomSheetModal>;
}

const ProductInventoryModal: React.FC<ProductInventoryModalProps> = ({
	productId,
	initialQuantity,
	modalRef
}) => {
	const [quantity, setQuantity] = React.useState(initialQuantity);
	const [{ fetching }, editProduct] = useEditProductMutation();
	const { bottom } = useSafeAreaInsets();

	// TODO: Add error handling
	const handleSubmit = async () => {
		await editProduct({
			id: productId,
			input: {
				quantity
			}
		});

		modalRef.current?.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography size='xlarge' weight='semibold'>
					Inventory
				</Typography>
				<Spacer y={16} />
				<Button
					text='Save'
					onPress={handleSubmit}
					loading={fetching}
					disabled={fetching}
				/>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductInventoryModal;
