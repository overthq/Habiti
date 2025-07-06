import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductsFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const ProductsFilterModal: React.FC<ProductsFilterModalProps> = ({
	modalRef
}) => {
	const { bottom } = useSafeAreaInsets();

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography weight='semibold' size='xlarge'>
					Filter
				</Typography>
				<Spacer y={12} />
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductsFilterModal;
