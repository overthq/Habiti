import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Typography } from '@habiti/components';

interface ProductsFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const ProductsFilterModal: React.FC<ProductsFilterModalProps> = ({
	modalRef
}) => {
	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView>
				<Typography>Filter</Typography>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductsFilterModal;
