import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Typography } from '@habiti/components';

import { useDeleteProductMutation } from '../../types/api';

interface ProductSettingsModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	productId: string;
}

const ProductSettingsModal: React.FC<ProductSettingsModalProps> = ({
	modalRef,
	productId
}) => {
	const [, deleteProduct] = useDeleteProductMutation();
	const { bottom } = useSafeAreaInsets();

	const handleDelete = async () => {
		await deleteProduct({ id: productId });
		modalRef.current?.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography weight='semibold' size='large'>
					Delete Product
				</Typography>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductSettingsModal;
