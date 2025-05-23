import React from 'react';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEditProductMutation } from '../../types/api';

interface ProductPriceModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	productId: string;
	initialPrice: number;
}

const ProductPriceModal: React.FC<ProductPriceModalProps> = ({
	modalRef,
	productId,
	initialPrice
}) => {
	const { bottom } = useSafeAreaInsets();
	const [{ fetching }, editProduct] = useEditProductMutation();

	const handleSubmit = async () => {
		await editProduct({
			id: productId,
			input: {
				unitPrice: initialPrice
			}
		});

		modalRef.current.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography size='xlarge' weight='semibold'>
					Price
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

export default ProductPriceModal;
