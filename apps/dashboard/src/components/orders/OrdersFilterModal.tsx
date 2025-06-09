import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Typography } from '@habiti/components';

interface OrdersFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const OrdersFilterModal: React.FC<OrdersFilterModalProps> = ({ modalRef }) => {
	return (
		<BottomModal modalRef={modalRef}>
			<BottomSheetView>
				<Typography>Filter</Typography>
			</BottomSheetView>
		</BottomModal>
	);
};

export default OrdersFilterModal;
